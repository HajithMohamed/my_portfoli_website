import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, ProjectStatus, SuggestionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { digestReadme, ReadmeSection } from './readme-digest';

/**
 * README snapshots and change notices are stored as sync records
 * (`SyncSuggestion` rows with this source) rather than new Project columns.
 * The API is deployed to Vercel, where migrations are not applied
 * automatically, so this feature needs no schema change to ship safely.
 *
 * A record is written only when a README is first seen ("baseline", already
 * acknowledged) or when its content changes ("change", pending until the
 * admin marks it reviewed). Unchanged checks write nothing.
 */
export const README_SOURCE = 'github:readme';

const CONCURRENCY = 4;
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_README_CHARS = 200_000;
const RECENT_UPDATES = 10;

export type ReadmeCommit = {
  sha: string;
  message: string;
  url: string;
  date: string | null;
  author: string | null;
};

export type ReadmeRecord = {
  kind: 'baseline' | 'change';
  projectId: string;
  slug: string;
  title: string;
  repo: string;
  path: string;
  sha: string;
  etag: string | null;
  htmlUrl: string;
  summary: string | null;
  sections: ReadmeSection[];
  previousSha: string | null;
  previousSummary: string | null;
  commit: ReadmeCommit | null;
  detectedAt: string;
};

/** README data attached to a project in API responses. */
export type ProjectReadme = {
  repo: string;
  htmlUrl: string;
  sha: string;
  summary: string | null;
  sections: ReadmeSection[];
  syncedAt: string;
  /** When the most recent README change was detected; null until one is. */
  changedAt: string | null;
};

export type ReadmeCheckStatus =
  'baseline' | 'changed' | 'unchanged' | 'missing' | 'skipped' | 'error';

export type ReadmeCheck = {
  projectId: string;
  slug: string;
  title: string;
  repo: string | null;
  status: ReadmeCheckStatus;
  message?: string;
};

export type ReadmeSyncReport = {
  checkedAt: string;
  checked: number;
  changed: number;
  failed: number;
  results: ReadmeCheck[];
};

export type ReadmeUpdate = {
  id: string;
  status: SuggestionStatus;
  createdAt: Date;
  title: string;
  record: ReadmeRecord;
};

type StoredRecord = {
  id: string;
  status: SuggestionStatus;
  createdAt: Date;
  title: string;
  record: ReadmeRecord;
};
type SyncProject = {
  id: string;
  slug: string;
  title: string;
  githubUrl: string | null;
};
type GithubReadmeFile = {
  sha: string;
  path: string;
  html_url: string;
  content?: string;
  encoding?: string;
};
type GithubCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author?: { name?: string; date?: string } | null };
  author?: { login?: string } | null;
};

@Injectable()
export class ReadmeSyncService {
  private readonly logger = new Logger(ReadmeSyncService.name);
  private running: Promise<ReadmeSyncReport> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Checks the README of every published project with a GitHub repository.
   * The admin UI calls this right after each sign-in. Concurrent calls share
   * one run.
   */
  sync(): Promise<ReadmeSyncReport> {
    this.running ??= this.run().finally(() => {
      this.running = null;
    });
    return this.running;
  }

  /** README change notices for the admin: unreviewed ones plus recent history. */
  async updates(): Promise<{
    pending: ReadmeUpdate[];
    recent: ReadmeUpdate[];
  }> {
    const changes = (await this.records()).filter(
      (row) => row.record.kind === 'change',
    );
    return {
      pending: changes.filter((row) => row.status === SuggestionStatus.PENDING),
      recent: changes
        .filter((row) => row.status !== SuggestionStatus.PENDING)
        .slice(0, RECENT_UPDATES),
    };
  }

  async acknowledge(id: string) {
    const row = await this.prisma.syncSuggestion.findFirst({
      where: { id, source: README_SOURCE },
    });
    if (!row) {
      throw new NotFoundException('README update not found');
    }
    await this.prisma.syncSuggestion.update({
      where: { id },
      data: { status: SuggestionStatus.APPROVED },
    });
    return { ok: true };
  }

  /**
   * Adds `readme` to each project. README data is supplementary, so a failure
   * here never breaks the projects API: projects are returned with `readme: null`.
   */
  async attach<T extends { id: string }>(
    projects: T[],
  ): Promise<Array<T & { readme: ProjectReadme | null }>> {
    try {
      const latest = await this.latestRecords();
      return projects.map((project) => ({
        ...project,
        readme: toProjectReadme(latest.get(project.id)),
      }));
    } catch (error) {
      this.logger.warn(`README data unavailable: ${errorMessage(error)}`);
      return projects.map((project) => ({ ...project, readme: null }));
    }
  }

  // ---- internals -------------------------------------------------------------

  private async run(): Promise<ReadmeSyncReport> {
    const projects: SyncProject[] = await this.prisma.project.findMany({
      where: { status: ProjectStatus.ACTIVE, githubUrl: { not: null } },
      select: { id: true, slug: true, title: true, githubUrl: true },
      orderBy: [{ homepageOrder: 'asc' }, { createdAt: 'asc' }],
    });
    const latest = await this.latestRecords();
    const results = await mapWithLimit(projects, CONCURRENCY, (project) =>
      this.check(project, latest.get(project.id) ?? null).catch(
        (error): ReadmeCheck => ({
          ...identity(project, githubRepo(project.githubUrl)),
          status: 'error',
          message: errorMessage(error),
        }),
      ),
    );
    const report: ReadmeSyncReport = {
      checkedAt: new Date().toISOString(),
      checked: results.length,
      changed: results.filter((result) => result.status === 'changed').length,
      failed: results.filter((result) => result.status === 'error').length,
      results,
    };
    this.logger.log(
      `README sync: ${report.checked} checked, ${report.changed} changed, ${report.failed} failed`,
    );
    return report;
  }

  private async check(
    project: SyncProject,
    previous: StoredRecord | null,
  ): Promise<ReadmeCheck> {
    const repo = githubRepo(project.githubUrl);
    const base = identity(project, repo);
    if (!repo) {
      return {
        ...base,
        status: 'skipped',
        message: 'Not a GitHub repository URL',
      };
    }

    const known =
      previous && previous.record.repo.toLowerCase() === repo.toLowerCase()
        ? previous
        : null;
    const response = await this.github(
      `https://api.github.com/repos/${repo}/readme`,
      known?.record.etag,
    );
    if (response.status === 304) {
      return { ...base, status: 'unchanged' };
    }
    if (response.status === 404) {
      return {
        ...base,
        status: 'missing',
        message: 'No README on the default branch',
      };
    }
    if (!response.ok) {
      return { ...base, status: 'error', message: githubFailure(response) };
    }

    const file = (await response.json()) as GithubReadmeFile;
    const etag = response.headers.get('etag');
    if (known && known.record.sha === file.sha) {
      if (etag && etag !== known.record.etag) {
        // Same content, new validator: keep it so the next check can be a free 304.
        await this.prisma.syncSuggestion.update({
          where: { id: known.id },
          data: { payload: inputJson({ ...known.record, etag }) },
        });
      }
      return { ...base, status: 'unchanged' };
    }

    const digest = digestReadme(decodeReadme(file));
    const changed = Boolean(known);
    const record: ReadmeRecord = {
      kind: changed ? 'change' : 'baseline',
      projectId: project.id,
      slug: project.slug,
      title: project.title,
      repo,
      path: file.path,
      sha: file.sha,
      etag,
      htmlUrl: file.html_url,
      summary: digest.summary,
      sections: digest.sections,
      previousSha: known?.record.sha ?? null,
      previousSummary: known?.record.summary ?? null,
      commit: changed ? await this.latestCommit(repo, file.path) : null,
      detectedAt: new Date().toISOString(),
    };
    await this.prisma.syncSuggestion.create({
      data: {
        source: README_SOURCE,
        title: changed
          ? `README updated: ${project.title}`
          : `README synced: ${project.title}`,
        payload: inputJson(record),
        status: changed ? SuggestionStatus.PENDING : SuggestionStatus.APPROVED,
      },
    });
    return { ...base, status: changed ? 'changed' : 'baseline' };
  }

  /** The commit that last touched the README, shown in the admin notice. */
  private async latestCommit(
    repo: string,
    path: string,
  ): Promise<ReadmeCommit | null> {
    try {
      const response = await this.github(
        `https://api.github.com/repos/${repo}/commits?path=${encodeURIComponent(path)}&per_page=1`,
      );
      if (!response.ok) return null;
      const [commit] = (await response.json()) as GithubCommit[];
      if (!commit) return null;
      return {
        sha: commit.sha,
        message: commit.commit.message.split('\n')[0].slice(0, 160),
        url: commit.html_url,
        date: commit.commit.author?.date ?? null,
        author: commit.author?.login ?? commit.commit.author?.name ?? null,
      };
    } catch {
      return null;
    }
  }

  private github(url: string, etag?: string | null): Promise<Response> {
    const token = this.config.get<string>('GITHUB_TOKEN')?.trim();
    return fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'mohamed-hajith-portfolio',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(etag ? { 'If-None-Match': etag } : {}),
      },
    });
  }

  private async records(): Promise<StoredRecord[]> {
    const rows = await this.prisma.syncSuggestion.findMany({
      where: { source: README_SOURCE },
      orderBy: { createdAt: 'desc' },
    });
    return rows.flatMap((row) => {
      const record = parseRecord(row.payload);
      return record
        ? [
            {
              id: row.id,
              status: row.status,
              createdAt: row.createdAt,
              title: row.title,
              record,
            },
          ]
        : [];
    });
  }

  /** Newest record per project. */
  private async latestRecords(): Promise<Map<string, StoredRecord>> {
    const latest = new Map<string, StoredRecord>();
    for (const row of await this.records()) {
      if (!latest.has(row.record.projectId))
        latest.set(row.record.projectId, row);
    }
    return latest;
  }
}

// ---- helpers -----------------------------------------------------------------

/** "owner/name" from a GitHub repository URL, or null for anything else. */
export function githubRepo(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (
      !['github.com', 'www.github.com'].includes(parsed.hostname.toLowerCase())
    )
      return null;
    const [owner, name] = parsed.pathname.split('/').filter(Boolean);
    const repo = name?.replace(/\.git$/i, '');
    const valid = /^[A-Za-z0-9_.-]+$/;
    return owner && repo && valid.test(owner) && valid.test(repo)
      ? `${owner}/${repo}`
      : null;
  } catch {
    return null;
  }
}

function toProjectReadme(row: StoredRecord | undefined): ProjectReadme | null {
  if (!row) return null;
  const { record } = row;
  return {
    repo: record.repo,
    htmlUrl: record.htmlUrl,
    sha: record.sha,
    summary: record.summary,
    sections: record.sections,
    syncedAt: record.detectedAt,
    changedAt: record.kind === 'change' ? record.detectedAt : null,
  };
}

function parseRecord(payload: Prisma.JsonValue): ReadmeRecord | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload))
    return null;
  const record = payload as Partial<ReadmeRecord>;
  if (
    (record.kind !== 'baseline' && record.kind !== 'change') ||
    typeof record.projectId !== 'string' ||
    typeof record.repo !== 'string' ||
    typeof record.sha !== 'string' ||
    typeof record.htmlUrl !== 'string' ||
    typeof record.detectedAt !== 'string'
  ) {
    return null;
  }
  return {
    ...(record as ReadmeRecord),
    summary: typeof record.summary === 'string' ? record.summary : null,
    sections: Array.isArray(record.sections) ? record.sections : [],
  };
}

function decodeReadme(file: GithubReadmeFile): string {
  if (!file.content) return '';
  const text =
    file.encoding === 'base64'
      ? Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8')
      : file.content;
  return text.slice(0, MAX_README_CHARS);
}

function githubFailure(response: Response): string {
  if (
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get('x-ratelimit-remaining') === '0')
  ) {
    return 'GitHub rate limit reached. Add GITHUB_TOKEN to the API environment for a higher limit.';
  }
  return `GitHub returned ${response.status}`;
}

function identity(project: SyncProject, repo: string | null) {
  return {
    projectId: project.id,
    slug: project.slug,
    title: project.title,
    repo,
  };
}

function inputJson(value: ReadmeRecord): Prisma.InputJsonObject {
  return value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'unknown error';
}

async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await task(items[index]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}
