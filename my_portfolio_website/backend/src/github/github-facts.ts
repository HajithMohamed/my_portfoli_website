export type GithubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  created_at?: string;
  updated_at?: string;
  homepage: string | null;
  topics?: string[];
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  default_branch?: string;
  open_issues_count?: number;
  visibility?: string;
  archived?: boolean;
  private?: boolean;
};

export type GithubRelease = {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
};

export type RepositoryInsight = {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  updatedAt: string | null;
  pushedAt: string | null;
  createdAt: string | null;
  homepage: string | null;
  liveUrl: string | null;
  topics: string[];
  stars: number;
  forks: number;
  isArchived: boolean;
  isHosted: boolean;
  isProductionReady: boolean;
  readinessChecked: boolean;
  readinessEvidence: {
    kind: 'topic' | 'release';
    label: string;
    url: string;
  }[];
  goal: string | null;
  goalSourceUrl: string;
  latestRelease: { tag: string; url: string; publishedAt: string } | null;
};

/** Owner repositories only: authenticated responses must never expose private work. */
export function publicOwnerRepos(
  repos: GithubRepo[],
  username: string,
): GithubRepo[] {
  return repos.filter(
    (repo) =>
      repo.private !== true &&
      (!repo.visibility || repo.visibility === 'public') &&
      repo.full_name.split('/')[0]?.toLowerCase() === username.toLowerCase(),
  );
}

export function mostRecentlyPushed(repos: GithubRepo[]): GithubRepo | null {
  return (
    repos
      .filter(
        (repo) =>
          !repo.fork &&
          !repo.archived &&
          repo.private !== true &&
          (!repo.visibility || repo.visibility === 'public'),
      )
      .sort((a, b) => timestamp(b.pushed_at) - timestamp(a.pushed_at))[0] ??
    null
  );
}

export function timestamp(value?: string | null): number {
  const parsed = value ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Validate metadata only. Never request user-controlled homepage URLs server-side. */
export function publicHomepage(value?: string | null): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      !host.includes('.') ||
      /^\d+(?:\.\d+){3}$/.test(host) ||
      host.includes(':') ||
      /(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host) ||
      host === 'github.com' ||
      host.endsWith('.github.com') ||
      host === 'example.com' ||
      host === 'example.org' ||
      host === 'example.net'
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

export function repositoryInsight(
  repo: GithubRepo,
  release: GithubRelease | null,
  readinessChecked: boolean,
  goal: string | null = repo.description,
  readmeUsed = false,
): RepositoryInsight {
  const homepage = publicHomepage(repo.homepage);
  const topics = repo.topics ?? [];
  const explicitReady = topics.some(
    (topic) => topic.toLowerCase() === 'production-ready',
  );
  const stableRelease =
    release && !release.draft && !release.prerelease && release.published_at
      ? {
          tag: release.tag_name,
          url: release.html_url,
          publishedAt: release.published_at,
        }
      : null;
  const readinessEvidence: RepositoryInsight['readinessEvidence'] = [];
  if (explicitReady)
    readinessEvidence.push({
      kind: 'topic',
      label: 'Marked production-ready by the repository owner',
      url: repo.html_url,
    });
  if (stableRelease)
    readinessEvidence.push({
      kind: 'release',
      label: `Published stable release ${stableRelease.tag}`,
      url: stableRelease.url,
    });
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    topics,
    updatedAt: repo.updated_at ?? repo.pushed_at ?? null,
    pushedAt: repo.pushed_at ?? null,
    createdAt: repo.created_at ?? null,
    homepage,
    liveUrl: homepage,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    isArchived: Boolean(repo.archived),
    isHosted: Boolean(homepage),
    isProductionReady: !repo.archived && readinessEvidence.length > 0,
    readinessChecked: readinessChecked || explicitReady,
    readinessEvidence,
    goal,
    goalSourceUrl: readmeUsed ? `${repo.html_url}#readme` : repo.html_url,
    latestRelease: stableRelease,
  };
}

export function repositoryStats(
  repos: RepositoryInsight[],
  publicCount: number,
  now = Date.now(),
) {
  const recent = (value: string | null) => {
    const time = timestamp(value);
    return time > 0 && time <= now && now - time <= 30 * 86_400_000;
  };
  return {
    publicRepositories: publicCount,
    createdRepositories: repos.length,
    activeRepositories: repos.filter(
      (repo) => !repo.isArchived && recent(repo.pushedAt),
    ).length,
    newRepositories: repos.filter((repo) => recent(repo.createdAt)).length,
    hostedProjects: repos.filter((repo) => repo.isHosted).length,
    productionReadyProjects: repos.filter((repo) => repo.isProductionReady)
      .length,
  };
}
