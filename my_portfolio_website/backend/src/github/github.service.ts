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
  stargazers_count: number;
  forks_count: number;
};

type GithubEvent = {
  type: string;
  repo?: { name: string };
  created_at: string;
  payload?: { commits?: unknown[] };
};

type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ContributionCalendar = {
  totalContributions: number;
  weeks: { days: ContributionDay[] }[];
};

export type ContributionData = {
  calendar: ContributionCalendar | null;
  totalStars: number;
  totalForks: number;
  totalContributions: number;
  technologies: string[];
  followers: number | null;
  following: number | null;
};

const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

@Injectable()
export class GithubService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(GithubService.name);
  private readonly username = 'HajithMohamed';
  private syncing = false;
  private syncTimer?: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // ---- scheduling ----------------------------------------------------------

  async onApplicationBootstrap() {
    const latest = await this.latestSummary();
    const stale =
      !latest ||
      Date.now() - new Date(latest.syncedAt).getTime() > SYNC_INTERVAL_MS;
    if (stale) {
      void this.safeSync('startup');
    }
    // Self-scheduled cron (dependency-free). unref() so it never blocks exit.
    this.syncTimer = setInterval(() => void this.safeSync('cron'), SYNC_INTERVAL_MS);
    this.syncTimer.unref?.();
  }

  onModuleDestroy() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }

  private async safeSync(trigger: string) {
    if (!this.configService.get<string>('GITHUB_TOKEN')) {
      this.logger.warn(`Skipping GitHub sync (${trigger}): GITHUB_TOKEN not set`);
      return;
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

  latestSummary() {
    return this.prisma.githubSnapshot.findFirst({
      orderBy: { syncedAt: 'desc' },
    });
  }

  suggestions() {
    return this.prisma.syncSuggestion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ---- sync ----------------------------------------------------------------

  async sync() {
    if (this.syncing) {
      return this.latestSummary();
    }
    this.syncing = true;
    try {
      const previous = await this.latestSummary();
      const repos = await this.fetchJson<GithubRepo[]>(
        `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`,
      );
      const events = await this.fetchJson<GithubEvent[]>(
        `https://api.github.com/users/${this.username}/events/public?per_page=50`,
      ).catch(() => [] as GithubEvent[]);

      const sourceRepos = repos.filter((repo) => !repo.fork);

      const languagePairs = await Promise.all(
        sourceRepos.slice(0, 20).map((repo) =>
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
        .reduce((count, event) => count + (event.payload?.commits?.length ?? 0), 0);

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
      }>(`https://api.github.com/users/${this.username}`).catch(() => null);

      const technologies = this.detectTechnologies(languages, sourceRepos);

      const recentRepos = sourceRepos.slice(0, 8).map((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        updatedAt: repo.pushed_at,
        homepage: repo.homepage,
        topics: repo.topics ?? [],
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
      }));

      const recentActivity = events.slice(0, 12).map((event) => ({
        type: event.type,
        repo: event.repo?.name,
        createdAt: event.created_at,
      }));

      const contributionData: ContributionData = {
        calendar,
        totalStars,
        totalForks,
        totalContributions: calendar?.totalContributions ?? commitCount,
        technologies,
        followers: userProfile?.followers ?? null,
        following: userProfile?.following ?? null,
      };

      const snapshot = await this.prisma.githubSnapshot.create({
        data: {
          username: this.username,
          repositoryCount: sourceRepos.length,
          commitCount,
          languages,
          recentRepos,
          recentActivity,
          contributionData: contributionData as unknown as Prisma.InputJsonValue,
        },
      });

      await this.createSuggestions(previous?.recentRepos, recentRepos);
      return snapshot;
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
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'hz-labs-portfolio-platform',
      },
      body: JSON.stringify({ query, variables: { login: this.username } }),
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
              weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
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
      ...raw.weeks.flatMap((week) => week.contributionDays.map((day) => day.contributionCount)),
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

  // ---- suggestions & dynamic case studies ----------------------------------

  async approveSuggestion(id: string) {
    const suggestion = await this.prisma.syncSuggestion.findUnique({ where: { id } });
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

    if (suggestion.source === 'github:new-repo' && payload.slug && payload.title) {
      const caseStudy = await this.buildCaseStudy(payload);
      await this.prisma.project.upsert({
        where: { slug: payload.slug },
        update: {
          githubUrl: payload.githubUrl,
          liveUrl: payload.liveUrl,
          description: payload.description ?? 'GitHub-synced project awaiting admin refinement.',
        },
        create: {
          title: payload.title,
          slug: payload.slug,
          description: payload.description ?? 'GitHub-synced project awaiting admin refinement.',
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
    const suggestion = await this.prisma.syncSuggestion.findUnique({ where: { id } });
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
    const overview = readme
      ? firstParagraph(readme)
      : (payload.description ?? `${payload.title} is a project from the HZ Labs GitHub.`);
    const stack = payload.techStack?.length
      ? payload.techStack.join(', ')
      : 'a modern full-stack toolchain';

    return [
      { heading: 'Overview', body: overview, order: 1 },
      {
        heading: 'Problem',
        body: `${payload.title} addresses a concrete engineering need. This draft was generated from the repository — refine the problem statement with the specific business or user context.`,
        order: 2,
      },
      {
        heading: 'Solution',
        body: readme
          ? extractSection(readme, ['features', 'usage', 'about']) ??
            `Built with ${stack}, focusing on a clean architecture and maintainable code.`
          : `Built with ${stack}, focusing on a clean architecture and maintainable code.`,
        order: 3,
      },
      { heading: 'Technologies', body: stack, order: 4 },
      {
        heading: 'Outcome',
        body: 'Summarize the measurable result, what you learned, and where this could go next.',
        order: 5,
      },
    ];
  }

  private async createSuggestions(
    previousJson: unknown,
    recentRepos: Array<{
      name: string;
      description?: string | null;
      url: string;
      language?: string | null;
      homepage?: string | null;
      topics?: string[];
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
          fullName: `${this.username}/${repo.name}`,
          techStack: [
            repo.language,
            ...(repo.topics ?? []).map(canonicalizeTech),
          ].filter((value): value is string => Boolean(value)),
          category: 'GitHub',
        } satisfies Prisma.InputJsonObject,
      })),
    });
  }

  // ---- http helpers --------------------------------------------------------

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

  private async fetchReadme(fullName: string): Promise<string> {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    const response = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        'User-Agent': 'hz-labs-portfolio-platform',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) {
      throw new Error(`README fetch failed: ${response.status}`);
    }
    return response.text();
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private titleize(value: string) {
    return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

// ---- module-level helpers ---------------------------------------------------

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
  netlify: 'Netlify',
  supabase: 'Supabase',
};

function canonicalizeTech(value: string): string {
  const key = value.toLowerCase().replace(/[.\s]/g, '').replace(/-/g, '');
  return TECH_ALIASES[key] ?? TECH_ALIASES[value.toLowerCase()] ?? titleCase(value);
}

function titleCase(value: string): string {
  return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
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
    if (match && headings.some((heading) => match[1].toLowerCase().includes(heading))) {
      const body: string[] = [];
      for (let j = i + 1; j < lines.length && !/^#{1,4}\s+/.test(lines[j]); j += 1) {
        body.push(lines[j]);
      }
      const text = body.join('\n').replace(/<[^>]+>/g, '').trim();
      if (text.length > 20) {
        return text.slice(0, 600);
      }
    }
  }
  return null;
}
