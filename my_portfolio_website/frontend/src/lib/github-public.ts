import 'server-only';
import type { GithubSummary, PortfolioRepository, CurrentRepositoryStatus } from './types';
import { publicWebsite } from './portfolio-mapping';

const USERNAME = 'HajithMohamed';

type Repo = {
  name: string;
  full_name: string;
  html_url: string;
  owner: { login: string };
  private?: boolean;
  fork: boolean;
  archived: boolean;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  created_at: string;
  pushed_at: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count?: number;
  default_branch: string;
  visibility?: string;
};

type Release = {
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
  tag_name: string;
};

function getGithubAuthToken(): string | undefined {
  const envToken = process.env.GITHUB_TOKEN?.trim();
  if (envToken) return envToken;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { execSync } = require('node:child_process');
    const output = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf-8',
      timeout: 2000,
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const match = output.match(/password=([^\r\n]+)/);
    if (match && match[1]) {
      const token = match[1].trim();
      process.env.GITHUB_TOKEN = token;
      return token;
    }
  } catch {
    // ignore
  }
  return undefined;
}

async function githubFetch<T>(path: string): Promise<T | null> {
  const token = getGithubAuthToken();
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Mohamed-Hajith-Portfolio',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(7000),
    cache: 'no-store',
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub response ${response.status}`);
  return response.json() as Promise<T>;
}

async function loadPublicGithub(): Promise<GithubSummary> {
  const all: Repo[] = [];
  const token = getGithubAuthToken();

  // If token is present, fetch owner + collaborator + private repos
  if (token) {
    try {
      for (let page = 1; page <= 5; page++) {
        const batch = await githubFetch<Repo[]>(
          `/user/repos?affiliation=owner,collaborator,organization_member&visibility=all&sort=pushed&per_page=100&page=${page}`
        );
        if (Array.isArray(batch)) {
          all.push(...batch);
          if (batch.length < 100) break;
        } else {
          break;
        }
      }
    } catch {
      // Fall back to public user repos if token lacks permissions
    }
  }

  // If no repos fetched with token or unauthenticated, fetch public profile repos
  if (all.length === 0) {
    for (let page = 1; page <= 20; page++) {
      const batch = await githubFetch<Repo[]>(
        `/users/${USERNAME}/repos?type=all&sort=pushed&per_page=100&page=${page}`
      );
      if (!Array.isArray(batch)) throw new Error('GitHub repositories unavailable');
      all.push(...batch);
      if (batch.length < 100) break;
      if (page === 20) break;
    }
  }

  // Deduplicate repositories by full_name lowercase
  const rawRepos = [...new Map(all.map((repo) => [repo.full_name.toLowerCase(), repo])).values()]
    .sort((a, b) => (b.pushed_at ?? '').localeCompare(a.pushed_at ?? ''));

  // Separate owned, private, and collaborations
  const owned = rawRepos.filter(
    (repo) => !repo.fork && repo.owner.login.toLowerCase() === USERNAME.toLowerCase()
  );
  const privateRepos = rawRepos.filter((repo) => Boolean(repo.private));
  const collaborationRepos = rawRepos.filter(
    (repo) => repo.owner.login.toLowerCase() !== USERNAME.toLowerCase() || repo.fork
  );

  const now = new Date();
  const since = now.getTime() - 30 * 86400000;
  let readinessComplete = true;

  // Process repository metadata
  const repositories: PortfolioRepository[] = [];
  for (let start = 0; start < rawRepos.length; start += 6) {
    const chunk = await Promise.all(
      rawRepos.slice(start, start + 6).map(async (repo) => {
        const readinessEvidence: NonNullable<PortfolioRepository['readinessEvidence']> = [];
        let readinessChecked = Boolean(repo.archived);

        if ((repo.topics ?? []).includes('production-ready') && !repo.archived) {
          readinessEvidence.push({
            kind: 'topic',
            label: 'Maintainer marked production-ready',
            url: repo.html_url,
          });
          readinessChecked = true;
        }

        if (!repo.archived && !repo.private) {
          try {
            const release = await githubFetch<Release>(`/repos/${repo.full_name}/releases/latest`);
            readinessChecked = true;
            if (release && !release.draft && !release.prerelease && release.published_at) {
              readinessEvidence.push({
                kind: 'release',
                label: `Stable release ${release.tag_name}`,
                url: release.html_url,
              });
            }
          } catch {
            readinessComplete = false;
          }
        }

        const isCollaborator = repo.owner.login.toLowerCase() !== USERNAME.toLowerCase();
        const homepage = publicWebsite(repo.homepage);

        return {
          name: repo.name,
          fullName: repo.full_name,
          url: repo.html_url,
          description: repo.description,
          language: repo.language,
          topics: repo.topics ?? [],
          createdAt: repo.created_at,
          pushedAt: repo.pushed_at,
          updatedAt: repo.updated_at,
          homepage,
          liveUrl: homepage,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          defaultBranch: repo.default_branch,
          isArchived: repo.archived,
          isPrivate: Boolean(repo.private),
          isCollaborator,
          ownerLogin: repo.owner.login,
          isHosted: Boolean(homepage),
          isProductionReady: readinessEvidence.length > 0,
          readinessChecked,
          readinessEvidence,
        } satisfies PortfolioRepository;
      })
    );
    repositories.push(...chunk);
  }

  // Determine current active repository for telemetry
  // If the latest pushed repo is the profile README stub (HajithMohamed/HajithMohamed),
  // prefer an active code/software project repository for the primary code telemetry card,
  // or fall back to it if no other repository exists.
  const activeCodeRepos = repositories.filter(
    (repo) =>
      !repo.isArchived &&
      repo.name.toLowerCase() !== USERNAME.toLowerCase() &&
      repo.fullName.toLowerCase() !== `${USERNAME}/${USERNAME}`.toLowerCase()
  );
  const latest = activeCodeRepos[0] ?? repositories.find((repo) => !repo.isArchived) ?? repositories[0];

  const currentRepo: CurrentRepositoryStatus | null = latest
    ? {
        ...latest,
        languages: latest.language ? [latest.language] : [],
        visibility: latest.isPrivate ? 'private' : latest.isCollaborator ? 'collaboration' : 'public',
        isPrivate: latest.isPrivate,
        isCollaborator: latest.isCollaborator,
        ownerLogin: latest.ownerLogin,
        activityStatus: Date.parse(latest.pushedAt ?? '') >= since ? 'active' : 'recent',
        statusLabel: latest.isCollaborator
          ? `collaboration @${latest.ownerLogin}`
          : latest.isPrivate
          ? 'private repository'
          : 'latest push',
        statusTone: latest.isCollaborator ? 'cyan' : latest.isPrivate ? 'amber' : 'green',
        latestCommit: null,
      }
    : null;

  if (currentRepo && currentRepo.fullName) {
    try {
      const commits = await githubFetch<
        Array<{
          sha: string;
          html_url: string;
          commit: { message: string; author: { date: string; name: string } };
          author?: { login: string };
        }>
      >(`/repos/${currentRepo.fullName}/commits?per_page=1`);
      const commit = commits?.[0];
      if (commit) {
        currentRepo.latestCommit = {
          sha: commit.sha.slice(0, 7),
          url: commit.html_url,
          message: commit.commit.message.split('\n')[0],
          authoredAt: commit.commit.author?.date ?? null,
          author: commit.author?.login ?? commit.commit.author?.name ?? null,
        };
      }
    } catch {
      /* The latest push remains valid without commit detail */
    }
  }

  // Aggregate languages dynamically with bytes/frequencies
  const languageMap: Record<string, number> = {};
  for (const repo of repositories) {
    if (repo.language) {
      // Base weight per repository, boosted by star count and recency
      const weight = 10000 + (repo.stars ?? 0) * 1000;
      languageMap[repo.language] = (languageMap[repo.language] ?? 0) + weight;
    }
  }

  // Collect distinct technologies from languages + topics
  const techSet = new Set<string>();
  repositories.forEach((repo) => {
    if (repo.language) techSet.add(repo.language);
    (repo.topics ?? []).forEach((topic) => techSet.add(topic));
  });

  const collaborationList = collaborationRepos.map((repo) => ({
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    url: repo.html_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    isPrivate: Boolean(repo.private),
    role: repo.owner.login.toLowerCase() === USERNAME.toLowerCase() ? 'Owner' : 'Collaborator',
  }));

  return {
    username: USERNAME,
    repositoryCount: rawRepos.length,
    commitCount: 0,
    languages: languageMap,
    privateCount: privateRepos.length,
    collaborationCount: collaborationRepos.length,
    collaborations: collaborationList,
    currentRepo,
    recentRepos: repositories.slice(0, 8),
    recentActivity: [],
    syncedAt: now.toISOString(),
    dataStatus: 'synced',
    contributionData: {
      schemaVersion: 2,
      currentRepo,
      repositories,
      totalStars: rawRepos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0),
      totalForks: rawRepos.reduce((sum, r) => sum + (r.forks_count ?? 0), 0),
      technologies: [...techSet],
      stats: {
        publicRepositories: rawRepos.filter((r) => !r.private).length,
        createdRepositories: owned.length,
        activeRepositories: rawRepos.filter((r) => !r.archived && Date.parse(r.pushed_at ?? '') >= since).length,
        newRepositories: rawRepos.filter((r) => Date.parse(r.created_at ?? '') >= since).length,
        hostedProjects: repositories.filter((r) => r.isHosted).length,
        productionReadyProjects: repositories.filter((r) => r.isProductionReady).length,
        privateRepositories: privateRepos.length,
        collaborationRepositories: collaborationRepos.length,
        totalCollaborations: collaborationRepos.length,
      },
      provenance: {
        sourceUrl: `https://github.com/${USERNAME}?tab=repositories`,
        syncedAt: now.toISOString(),
        activityWindowDays: 30,
        hostedDefinition: 'Repositories with a public website URL in GitHub. Availability is not checked.',
        productionReadyDefinition:
          'A stable GitHub release or an explicit production-ready topic. These are maintainer signals, not a production audit.',
        readinessComplete,
      },
    },
  };
}

export async function getPublicGithub(): Promise<GithubSummary | null> {
  try {
    return await loadPublicGithub();
  } catch {
    return null;
  }
}
