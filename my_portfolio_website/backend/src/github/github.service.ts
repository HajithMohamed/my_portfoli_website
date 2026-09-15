import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, ProjectStatus, SuggestionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  GithubRepo,
  GithubRelease,
  RepositoryInsight,
  mostRecentlyPushed,
  publicHomepage,
  publicOwnerRepos,
  repositoryInsight,
  repositoryStats,
  timestamp,
} from './github-facts';

type GithubEvent = {
  type: string;
  repo?: { name: string };
  created_at: string;
  payload?: { commits?: unknown[] };
};

type GithubCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author?: { name?: string; date?: string };
  };
  author?: { login?: string } | null;
};

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};
type ContributionCalendar = {
  totalContributions: number;
  weeks: { days: ContributionDay[] }[];
};

export type ContributionData = {
  schemaVersion: 2;
  calendar: ContributionCalendar | null;
  totalStars: number;
  totalForks: number;
  totalContributions: number;
  technologies: string[];
  followers: number | null;
  following: number | null;
  currentRepo: CurrentRepoStatus | null;
  repositories: RepositoryInsight[];
  stats: ReturnType<typeof repositoryStats>;
  provenance: {
    sourceUrl: string;
    syncedAt: string;
    activityWindowDays: number;
    hostedDefinition: string;
    productionReadyDefinition: string;
    readinessComplete: boolean;
    languageRepositoriesSampled: number;
  };
};

export type CurrentRepoStatus = {
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  languages: string[];
  topics: string[];
  defaultBranch: string;
  updatedAt: string | null;
  pushedAt: string | null;
  homepage: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  visibility: string;
  isArchived: boolean;
  latestCommit: {
    sha: string;
    url: string;
    message: string;
    authoredAt: string | null;
    author: string | null;
  } | null;
  activityStatus:
    'active' | 'recent' | 'quiet' | 'stale' | 'unknown' | 'archived';
  statusLabel: string;
  statusTone: 'green' | 'amber' | 'cyan' | 'red';
};

const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const DEFAULT_GITHUB_USERNAME = 'HajithMohamed';

@Injectable()
export class GithubService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(GithubService.name);
  private syncing = false;
  private syncTimer?: NodeJS.Timeout;
  private enrichmentBudget = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // ---- scheduling ----------------------------------------------------------

  async onApplicationBootstrap() {
    const latest = await this.latestSummary().catch((error) => {
      this.logger.warn(
        `GitHub snapshot unavailable at startup: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      return null;
    });
    const stale =
      !latest ||
      !isRecord(latest.contributionData) ||
      latest.contributionData.schemaVersion !== 2 ||
      Date.now() - new Date(latest.syncedAt).getTime() > SYNC_INTERVAL_MS;
    if (stale) {
      void this.safeSync('startup');
    }
    // Self-scheduled cron (dependency-free). unref() so it never blocks exit.
    this.syncTimer = setInterval(
      () => void this.safeSync('cron'),
      SYNC_INTERVAL_MS,
    );
    this.syncTimer.unref?.();
  }

  onModuleDestroy() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }

  private async safeSync(trigger: string) {
    if (!this.configService.get<string>('GITHUB_TOKEN')) {
      this.logger.warn(
        `GitHub sync (${trigger}) using public REST API only: GITHUB_TOKEN not set`,
      );
    }
    try {
      await this.sync();
      this.logger.log(`GitHub sync (${trigger}) complete`);
    } catch (error) {
      this.logger.warn(
        `GitHub sync (${trigger}) failed: ${error instanceof Error ? error.message : 'unknown'}`,
      );
    }
  }

  // ---- reads ---------------------------------------------------------------

  async latestSummary() {
    const snapshot = await this.prisma.githubSnapshot.findFirst({
      orderBy: { syncedAt: 'desc' },
    });
    return this.decorateSnapshot(snapshot);
  }

  suggestions() {
    return this.prisma.syncSuggestion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  private decorateSnapshot<
    T extends { contributionData: unknown; recentRepos: unknown },
  >(snapshot: T | null) {
    if (!snapshot) {
      return null;
    }

    const contributionData = isRecord(snapshot.contributionData)
      ? snapshot.contributionData
      : {};
    const currentRepo =
      contributionData.schemaVersion === 2 &&
      isRecord(contributionData.currentRepo)
        ? contributionData.currentRepo
        : this.currentRepoFromRecent(snapshot.recentRepos);

    return {
      ...snapshot,
      currentRepo,
      contributionData: {
        ...contributionData,
        currentRepo,
      },
    };
  }

  private currentRepoFromRecent(
    recentRepos: unknown,
  ): CurrentRepoStatus | null {
    const repos = Array.isArray(recentRepos)
      ? recentRepos.filter(isRecord)
      : [];
    const selected = repos
      .filter(
        (repo) =>
          !repo.isArchived &&
          !repo.fork &&
          repo.private !== true &&
          (!repo.visibility || repo.visibility === 'public'),
      )
      .sort(
        (a, b) =>
          timestamp(stringValue(b.pushedAt) ?? stringValue(b.updatedAt)) -
          timestamp(stringValue(a.pushedAt) ?? stringValue(a.updatedAt)),
      )[0];

    if (!selected) {
      return null;
    }

    const name = stringValue(selected.name) ?? 'repository';
    const fullName =
      stringValue(selected.fullName) ?? `${this.githubUsername()}/${name}`;
    const activity = this.repoActivity(
      stringValue(selected.pushedAt) ?? stringValue(selected.updatedAt),
    );

    return {
      name,
      fullName,
      url: stringValue(selected.url) ?? `https://github.com/${fullName}`,
      description: stringValue(selected.description) ?? null,
      language: stringValue(selected.language) ?? null,
      languages: stringValue(selected.language)
        ? [stringValue(selected.language) as string]
        : [],
      topics: Array.isArray(selected.topics)
        ? selected.topics.filter(
            (topic): topic is string => typeof topic === 'string',
          )
        : [],
      defaultBranch: 'main',
      updatedAt: stringValue(selected.updatedAt) ?? null,
      pushedAt:
        stringValue(selected.pushedAt) ??
        stringValue(selected.updatedAt) ??
        null,
      homepage: publicHomepage(stringValue(selected.homepage)),
      stars: numberValue(selected.stars),
      forks: numberValue(selected.forks),
      openIssues: 0,
      visibility: 'public',
      isArchived: false,
      latestCommit: null,
      activityStatus: activity.activityStatus,
      statusLabel: activity.statusLabel,
      statusTone: activity.statusTone,
    };
  }

  private githubUsername() {
    return (
      this.configService.get<string>('GITHUB_USERNAME')?.trim() ||
      DEFAULT_GITHUB_USERNAME
    );
  }

  // ---- sync ----------------------------------------------------------------

  async sync() {
    if (this.syncing) {
      return this.latestSummary();
    }
    this.syncing = true;
    try {
      const previous = await this.latestSummary();
      const username = this.githubUsername();
      const repos = await this.fetchPublicRepositories(username);
      const events = await this.fetchJson<GithubEvent[]>(
        `https://api.github.com/users/${username}/events/public?per_page=50`,
      ).catch(() => [] as GithubEvent[]);

      const sourceRepos = repos
        .filter((repo) => !repo.fork)
        .sort((a, b) => timestamp(b.pushed_at) - timestamp(a.pushed_at));
      const currentRepo = await this.resolveCurrentRepoStatus(sourceRepos);

      const languagePairs = await Promise.all(
        sourceRepos.slice(0, 5).map((repo) =>
          this.fetchJson<Record<string, number>>(
            `https://api.github.com/repos/${repo.full_name}/languages`,
          )
            .then((languages) => Object.entries(languages))
            .catch(() => [] as [string, number][]),
        ),
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

      const totalStars = sourceRepos.reduce(
        (sum, repo) => sum + (repo.stargazers_count ?? 0),
        0,
      );
      const totalForks = sourceRepos.reduce(
        (sum, repo) => sum + (repo.forks_count ?? 0),
        0,
      );

      const calendar = await this.fetchContributionCalendar().catch(() => null);

      const userProfile = await this.fetchJson<{
        followers?: number;
        following?: number;
      }>(`https://api.github.com/users/${username}`).catch(() => null);

      const technologies = this.detectTechnologies(languages, sourceRepos);

      // Public API has a small hourly allowance. Preserve complete repository
      // counts even when optional README/release enrichment is rate limited.
      this.enrichmentBudget = this.configService.get<string>('GITHUB_TOKEN')
        ? 1000
        : 36;
      const repositories: RepositoryInsight[] = [];
      for (let offset = 0; offset < sourceRepos.length; offset += 4) {
        repositories.push(
          ...(await Promise.all(
            sourceRepos
              .slice(offset, offset + 4)
              .map((repo) => this.enrichRepository(repo)),
          )),
        );
      }
      const recentRepos = repositories.slice(0, 8);

      const recentActivity = events.slice(0, 12).map((event) => ({
        type: event.type,
        repo: event.repo?.name,
        createdAt: event.created_at,
      }));

      const contributionData: ContributionData = {
        schemaVersion: 2,
        calendar,
        totalStars,
        totalForks,
        totalContributions: calendar?.totalContributions ?? commitCount,
        technologies,
        followers: userProfile?.followers ?? null,
        following: userProfile?.following ?? null,
        currentRepo,
        repositories,
        stats: repositoryStats(repositories, repos.length),
        provenance: {
          sourceUrl: `https://github.com/${username}?tab=repositories`,
          syncedAt: new Date().toISOString(),
          activityWindowDays: 30,
          hostedDefinition:
            'Public source repositories with an external homepage URL listed on GitHub. Availability has not been checked.',
          productionReadyDefinition:
            'Unarchived public source repositories marked production-ready by their owner or with a published stable GitHub release. This is repository evidence, not a security or production audit.',
          readinessComplete: repositories.every(
            (repo) => repo.readinessChecked,
          ),
          languageRepositoriesSampled: Math.min(sourceRepos.length, 5),
        },
      };

      const snapshot = await this.prisma.githubSnapshot.create({
        data: {
          username,
          repositoryCount: sourceRepos.length,
          commitCount,
          languages,
          recentRepos: inputJson(recentRepos),
          recentActivity,
          contributionData: inputJson(contributionData),
        },
      });

      const previousData: Record<string, unknown> =
        previous && isRecord(previous.contributionData)
          ? previous.contributionData
          : {};
      await this.createSuggestions(
        previousData.repositories ?? previous?.recentRepos,
        repositories,
      );
      return this.decorateSnapshot(snapshot);
    } finally {
      this.syncing = false;
    }
  }

  /** Real contribution calendar via the GitHub GraphQL API (requires a token). */
  private async fetchContributionCalendar(): Promise<ContributionCalendar | null> {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    if (!token) {
      return null;
    }
    const username = this.githubUsername();
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { date contributionCount }
              }
            }
          }
        }
      }`;
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      signal: AbortSignal.timeout(12_000),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'mohamed-hajith-portfolio',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });
    if (!response.ok) {
      throw new Error(`GitHub GraphQL failed: ${response.status}`);
    }
    const json = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions: number;
              weeks: {
                contributionDays: { date: string; contributionCount: number }[];
              }[];
            };
          };
        };
      };
    };
    const raw = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!raw) {
      return null;
    }

    const max = Math.max(
      1,
      ...raw.weeks.flatMap((week) =>
        week.contributionDays.map((day) => day.contributionCount),
      ),
    );
    const level = (count: number): 0 | 1 | 2 | 3 | 4 => {
      if (count === 0) return 0;
      const ratio = count / max;
      if (ratio > 0.66) return 4;
      if (ratio > 0.33) return 3;
      if (ratio > 0.12) return 2;
      return 1;
    };

    return {
      totalContributions: raw.totalContributions,
      weeks: raw.weeks.map((week) => ({
        days: week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: level(day.contributionCount),
        })),
      })),
    };
  }

  /** Normalize languages + repo topics into a de-duplicated technology list. */
  private detectTechnologies(
    languages: Record<string, number>,
    repos: GithubRepo[],
  ): string[] {
    const seen = new Map<string, string>();
    const add = (value?: string | null) => {
      if (!value) return;
      const canonical = canonicalizeTech(value);
      if (canonical && !seen.has(canonical.toLowerCase())) {
        seen.set(canonical.toLowerCase(), canonical);
      }
    };
    Object.keys(languages).forEach(add);
    repos.forEach((repo) => (repo.topics ?? []).forEach(add));
    return [...seen.values()];
  }

  private async resolveCurrentRepoStatus(
    sourceRepos: GithubRepo[],
  ): Promise<CurrentRepoStatus | null> {
    const repo = mostRecentlyPushed(sourceRepos);
    if (!repo) {
      return null;
    }

    return this.buildCurrentRepoStatus(repo);
  }

  private async buildCurrentRepoStatus(
    repo: GithubRepo,
  ): Promise<CurrentRepoStatus> {
    const defaultBranch = repo.default_branch ?? 'main';
    const [languageBytes, latestCommit] = await Promise.all([
      this.fetchJson<Record<string, number>>(
        `https://api.github.com/repos/${repo.full_name}/languages`,
      ).catch(() => ({})),
      this.fetchLatestCommit(repo.full_name, defaultBranch).catch(() => null),
    ]);
    const activity = this.repoActivity(repo.pushed_at, Boolean(repo.archived));

    return {
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      languages: Object.keys(languageBytes),
      topics: repo.topics ?? [],
      defaultBranch,
      updatedAt: repo.updated_at ?? repo.pushed_at ?? null,
      pushedAt: repo.pushed_at ?? null,
      homepage: publicHomepage(repo.homepage),
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      openIssues: repo.open_issues_count ?? 0,
      visibility: 'public',
      isArchived: Boolean(repo.archived),
      latestCommit,
      activityStatus: activity.activityStatus,
      statusLabel: activity.statusLabel,
      statusTone: activity.statusTone,
    };
  }

  private async fetchLatestCommit(fullName: string, branch: string) {
    const commits = await this.fetchJson<GithubCommit[]>(
      `https://api.github.com/repos/${fullName}/commits?sha=${encodeURIComponent(
        branch,
      )}&per_page=1`,
    );
    const latest = commits[0];
    if (!latest) {
      return null;
    }

    return {
      sha: latest.sha.slice(0, 7),
      url: latest.html_url,
      message: latest.commit.message.split('\n')[0].slice(0, 120),
      authoredAt: latest.commit.author?.date ?? null,
      author: latest.author?.login ?? latest.commit.author?.name ?? null,
    };
  }

  private repoActivity(
    pushedAt?: string | null,
    archived = false,
  ): Pick<CurrentRepoStatus, 'activityStatus' | 'statusLabel' | 'statusTone'> {
    if (archived) {
      return {
        activityStatus: 'archived',
        statusLabel: 'archived',
        statusTone: 'amber',
      };
    }
    if (!pushedAt) {
      return {
        activityStatus: 'unknown',
        statusLabel: 'awaiting sync',
        statusTone: 'cyan',
      };
    }
    const timestamp = new Date(pushedAt).getTime();
    if (Number.isNaN(timestamp)) {
      return {
        activityStatus: 'unknown',
        statusLabel: 'awaiting sync',
        statusTone: 'cyan',
      };
    }
    const days = (Date.now() - timestamp) / 86_400_000;
    if (days <= 7) {
      return {
        activityStatus: 'active',
        statusLabel: 'active now',
        statusTone: 'green',
      };
    }
    if (days <= 30) {
      return {
        activityStatus: 'recent',
        statusLabel: 'recent push',
        statusTone: 'green',
      };
    }
    if (days <= 90) {
      return {
        activityStatus: 'quiet',
        statusLabel: 'quiet',
        statusTone: 'amber',
      };
    }
    return {
      activityStatus: 'stale',
      statusLabel: 'needs update',
      statusTone: 'red',
    };
  }

  // ---- suggestions & dynamic case studies ----------------------------------

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
      fullName?: string;
    };

    if (
      suggestion.source === 'github:new-repo' &&
      payload.slug &&
      payload.title
    ) {
      const caseStudy = await this.buildCaseStudy(payload);
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
          caseStudy: caseStudy.length ? { create: caseStudy } : undefined,
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

  /** Generate case-study sections from repo metadata + README (best-effort). */
  private async buildCaseStudy(payload: {
    title?: string;
    description?: string;
    techStack?: string[];
    fullName?: string;
    liveUrl?: string;
    githubUrl?: string;
  }): Promise<{ heading: string; body: string; order: number }[]> {
    const readme = payload.fullName
      ? await this.fetchReadme(payload.fullName).catch(() => null)
      : null;
    const sections: { heading: string; body: string; order: number }[] = [];
    const add = (heading: string, body?: string | null) => {
      if (body?.trim())
        sections.push({ heading, body, order: sections.length + 1 });
    };
    add(
      'Project goal',
      readme
        ? (extractSection(readme, [
            'goal',
            'objective',
            'purpose',
            'overview',
            'about',
          ]) ??
            payload.description ??
            firstParagraph(readme))
        : payload.description,
    );
    add(
      'Repository features',
      readme ? extractSection(readme, ['features', 'capabilities']) : null,
    );
    add(
      'Technologies',
      payload.techStack?.length ? payload.techStack.join(', ') : null,
    );
    add(
      'Source',
      `${payload.githubUrl ?? (payload.fullName ? `https://github.com/${payload.fullName}` : '')}\nDraft based on public repository metadata${readme ? ' and README' : ''}. Outcomes and production readiness have not been independently verified.`,
    );
    return sections;
  }

  private async createSuggestions(
    previousJson: unknown,
    recentRepos: RepositoryInsight[],
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

    // Include historical repositories on first sync, while never re-creating an
    // already reviewed suggestion (including a rejected one).
    const existing = await this.prisma.syncSuggestion.findMany({
      where: { source: 'github:new-repo' },
      select: { payload: true },
    });
    const existingNames = new Set(
      existing.map((suggestion) =>
        isRecord(suggestion.payload)
          ? stringValue(suggestion.payload.fullName)?.toLowerCase()
          : undefined,
      ),
    );
    const newRepos = recentRepos
      .filter(
        (repo) =>
          typeof repo.name === 'string' && !previousNames.has(repo.name),
      )
      .filter((repo) => !existingNames.has(repo.fullName.toLowerCase()));
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
          description: repo.goal ?? repo.description,
          githubUrl: repo.url,
          liveUrl: repo.homepage ?? null,
          fullName: repo.fullName ?? `${this.githubUsername()}/${repo.name}`,
          techStack: [
            repo.language,
            ...(repo.topics ?? []).map(canonicalizeTech),
          ].filter((value): value is string => Boolean(value)),
          category: 'GitHub',
          goalSourceUrl: repo.goalSourceUrl,
          isHosted: repo.isHosted,
          isProductionReady: repo.isProductionReady,
          readinessEvidence: repo.readinessEvidence,
        } satisfies Prisma.InputJsonObject,
      })),
    });
  }

  // ---- http helpers --------------------------------------------------------

  private async fetchPublicRepositories(
    username: string,
  ): Promise<GithubRepo[]> {
    const repos: GithubRepo[] = [];
    for (let page = 1; ; page += 1) {
      const batch = await this.fetchJson<GithubRepo[]>(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&per_page=100&page=${page}`,
      );
      repos.push(...publicOwnerRepos(batch, username));
      if (batch.length < 100) break;
    }
    return [
      ...new Map(
        repos.map((repo) => [repo.full_name.toLowerCase(), repo]),
      ).values(),
    ];
  }

  private async enrichRepository(repo: GithubRepo): Promise<RepositoryInsight> {
    let release: GithubRelease | null = null;
    let readinessChecked = false;
    let readme: string | null = null;
    if (this.enrichmentBudget > 0) {
      this.enrichmentBudget -= 1;
      try {
        // /releases/latest excludes drafts and pre-releases. A 404 is valid
        // evidence of no published stable release, other failures stay unknown.
        release = await this.fetchJson<GithubRelease | null>(
          `https://api.github.com/repos/${encodeRepoFullName(repo.full_name)}/releases/latest`,
          true,
        );
        readinessChecked = true;
      } catch {
        /* Optional enrichment must not discard a complete repo list. */
      }
    }
    if (this.enrichmentBudget > 0) {
      this.enrichmentBudget -= 1;
      readme = await this.fetchReadme(repo.full_name).catch(() => null);
    }
    const goal = readme
      ? (extractSection(readme, [
          'goal',
          'objective',
          'purpose',
          'overview',
          'about',
        ]) ??
        repo.description ??
        firstParagraph(readme))
      : repo.description;
    return repositoryInsight(
      repo,
      release,
      readinessChecked,
      goal,
      Boolean(readme && (!repo.description || goal !== repo.description)),
    );
  }

  private async fetchJson<T>(url: string, allowNotFound = false): Promise<T> {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    const response = await fetch(url, {
      signal: AbortSignal.timeout(12_000),
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'mohamed-hajith-portfolio',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (response.status === 404 && allowNotFound) return null as T;
    if (!response.ok) {
      throw new Error(
        `GitHub API request failed: ${response.status} ${response.statusText}`,
      );
    }
    return (await response.json()) as T;
  }

  private async fetchReadme(fullName: string): Promise<string> {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    const response = await fetch(
      `https://api.github.com/repos/${encodeRepoFullName(fullName)}/readme`,
      {
        signal: AbortSignal.timeout(12_000),
        headers: {
          Accept: 'application/vnd.github.raw+json',
          'User-Agent': 'mohamed-hajith-portfolio',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    if (!response.ok) {
      throw new Error(`README fetch failed: ${response.status}`);
    }
    return (await response.text()).slice(0, 100_000);
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

// ---- module-level helpers ---------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function numberValue(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/** Values assembled for snapshots contain only JSON-safe API data. */
function inputJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function encodeRepoFullName(fullName: string): string {
  return fullName.split('/').map(encodeURIComponent).join('/');
}

// Map GitHub topics / language variants onto canonical technology names.
const TECH_ALIASES: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  nextjs: 'Next.js',
  'next-js': 'Next.js',
  react: 'React',
  reactjs: 'React',
  node: 'Node.js',
  nodejs: 'Node.js',
  nestjs: 'NestJS',
  nest: 'NestJS',
  express: 'Express',
  expressjs: 'Express',
  tailwind: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  mongo: 'MongoDB',
  mysql: 'MySQL',
  prisma: 'Prisma',
  docker: 'Docker',
  redux: 'Redux',
  php: 'PHP',
  python: 'Python',
  html: 'HTML',
  css: 'CSS',
  figma: 'Figma',
  graphql: 'GraphQL',
  jwt: 'JWT',
  cloudinary: 'Cloudinary',
  vercel: 'Vercel',
  supabase: 'Supabase',
};

function canonicalizeTech(value: string): string {
  const key = value.toLowerCase().replace(/[.\s]/g, '').replace(/-/g, '');
  return (
    TECH_ALIASES[key] ?? TECH_ALIASES[value.toLowerCase()] ?? titleCase(value)
  );
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function firstParagraph(markdown: string): string {
  const cleaned = markdown
    .replace(/^#.*$/gm, '') // drop headings
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // drop images
    .replace(/<[^>]+>/g, '') // drop html
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block.length > 40);
  return (cleaned ?? 'Project overview coming soon.').slice(0, 600);
}

function extractSection(markdown: string, headings: string[]): string | null {
  const lines = markdown.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^#{1,4}\s+(.*)/);
    if (
      match &&
      headings.some((heading) => match[1].toLowerCase().includes(heading))
    ) {
      const body: string[] = [];
      for (
        let j = i + 1;
        j < lines.length && !/^#{1,4}\s+/.test(lines[j]);
        j += 1
      ) {
        body.push(lines[j]);
      }
      const text = body
        .join('\n')
        .replace(/<[^>]+>/g, '')
        .trim();
      if (text.length > 20) {
        return text.slice(0, 600);
      }
    }
  }
  return null;
}
