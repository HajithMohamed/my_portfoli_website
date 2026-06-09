import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, ProjectStatus, SuggestionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type GithubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  homepage: string | null;
  topics?: string[];
  fork: boolean;
};

type GithubEvent = {
  type: string;
  repo?: { name: string };
  created_at: string;
  payload?: { commits?: unknown[] };
};

@Injectable()
export class GithubService {
  private readonly username = 'HajithMohamed';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  latestSummary() {
    return this.prisma.githubSnapshot.findFirst({
      orderBy: { syncedAt: 'desc' },
    });
  }

  async sync() {
    const previous = await this.latestSummary();
    const repos = await this.fetchJson<GithubRepo[]>(
      `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`,
    );
    const events = await this.fetchJson<GithubEvent[]>(
      `https://api.github.com/users/${this.username}/events/public?per_page=50`,
    );

    const sourceRepos = repos.filter((repo) => !repo.fork);
    const languagePairs = await Promise.all(
      sourceRepos.slice(0, 20).map(async (repo) => {
        const languages = await this.fetchJson<Record<string, number>>(
          `https://api.github.com/repos/${repo.full_name}/languages`,
        ).catch(() => ({}));
        return Object.entries(languages);
      }),
    );

    const languages = languagePairs
      .flat()
      .reduce<Record<string, number>>((acc, [language, bytes]) => {
        acc[language] = (acc[language] ?? 0) + bytes;
        return acc;
      }, {});

    const commitCount = events
      .filter((event) => event.type === 'PushEvent')
      .reduce(
        (count, event) => count + (event.payload?.commits?.length ?? 0),
        0,
      );

    const recentRepos = sourceRepos.slice(0, 8).map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      updatedAt: repo.pushed_at,
      homepage: repo.homepage,
      topics: repo.topics ?? [],
    }));

    const recentActivity = events.slice(0, 12).map((event) => ({
      type: event.type,
      repo: event.repo?.name,
      createdAt: event.created_at,
    }));

    const snapshot = await this.prisma.githubSnapshot.create({
      data: {
        username: this.username,
        repositoryCount: sourceRepos.length,
        commitCount,
        languages,
        recentRepos,
        recentActivity,
      },
    });

    await this.createSuggestions(previous?.recentRepos, recentRepos);
    return snapshot;
  }

  suggestions() {
    return this.prisma.syncSuggestion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveSuggestion(id: string) {
    const suggestion = await this.prisma.syncSuggestion.findUnique({
      where: { id },
    });
    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }

    const payload = suggestion.payload as {
      slug?: string;
      title?: string;
      description?: string;
      githubUrl?: string;
      liveUrl?: string;
      techStack?: string[];
      category?: string;
    };

    if (
      suggestion.source === 'github:new-repo' &&
      payload.slug &&
      payload.title
    ) {
      await this.prisma.project.upsert({
        where: { slug: payload.slug },
        update: {
          githubUrl: payload.githubUrl,
          liveUrl: payload.liveUrl,
          description:
            payload.description ??
            'GitHub-synced project awaiting admin refinement.',
        },
        create: {
          title: payload.title,
          slug: payload.slug,
          description:
            payload.description ??
            'GitHub-synced project awaiting admin refinement.',
          techStack: payload.techStack ?? [],
          githubUrl: payload.githubUrl,
          liveUrl: payload.liveUrl,
          category: payload.category ?? 'GitHub',
          status: ProjectStatus.DRAFT,
        },
      });
    }

    return this.prisma.syncSuggestion.update({
      where: { id },
      data: { status: SuggestionStatus.APPROVED },
    });
  }

  async rejectSuggestion(id: string) {
    const suggestion = await this.prisma.syncSuggestion.findUnique({
      where: { id },
    });
    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }
    return this.prisma.syncSuggestion.update({
      where: { id },
      data: { status: SuggestionStatus.REJECTED },
    });
  }

  private async createSuggestions(
    previousJson: unknown,
    recentRepos: Array<{
      name: string;
      description?: string | null;
      url: string;
      language?: string | null;
      homepage?: string | null;
    }>,
  ) {
    const previousRepos = Array.isArray(previousJson) ? previousJson : [];
    const previousNames = new Set(
      previousRepos
        .map((repo) =>
          typeof repo === 'object' && repo !== null
            ? (repo as { name?: string }).name
            : undefined,
        )
        .filter(Boolean),
    );

    const newRepos = recentRepos.filter(
      (repo) => typeof repo.name === 'string' && !previousNames.has(repo.name),
    );
    if (!newRepos.length) {
      return;
    }

    await this.prisma.syncSuggestion.createMany({
      data: newRepos.map((repo) => ({
        source: 'github:new-repo',
        title: `Review GitHub repository: ${String(repo.name)}`,
        payload: {
          title: this.titleize(String(repo.name)),
          slug: this.slugify(String(repo.name)),
          description: repo.description,
          githubUrl: repo.url,
          liveUrl: repo.homepage ?? null,
          techStack: repo.language ? [repo.language] : [],
          category: 'GitHub',
        } satisfies Prisma.InputJsonObject,
      })),
    });
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'hz-labs-portfolio-platform',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private titleize(value: string) {
    return value
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
