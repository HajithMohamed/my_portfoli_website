import 'server-only';
import { unstable_cache } from 'next/cache';
import type { GithubSummary, PortfolioRepository } from './types';
import { publicWebsite } from './portfolio-mapping';

const USERNAME = 'HajithMohamed';
type Repo = { name: string; full_name: string; html_url: string; owner: {login: string}; private: boolean; fork: boolean; archived: boolean; description: string | null; homepage: string | null; language: string | null; topics: string[]; created_at: string; pushed_at: string; updated_at: string; stargazers_count: number; forks_count: number; default_branch: string };
type Release = { draft: boolean; prerelease: boolean; published_at: string | null; html_url: string; tag_name: string };

async function githubFetch<T>(path: string): Promise<T | null> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Mohamed-Hajith-Portfolio',
      ...(process.env.GITHUB_TOKEN ? {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`} : {}) },
    signal: AbortSignal.timeout(7000), next: { revalidate: 3600 },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub response ${response.status}`);
  return response.json() as Promise<T>;
}

const loadPublicGithub = unstable_cache(async (): Promise<GithubSummary> => {
  const all: Repo[] = [];
  for (let page = 1; page <= 20; page++) {
    const batch = await githubFetch<Repo[]>(`/users/${USERNAME}/repos?type=owner&sort=pushed&per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error('GitHub repositories unavailable');
    all.push(...batch.filter(repo => !repo.private && repo.owner.login.toLowerCase() === USERNAME.toLowerCase()));
    if (batch.length < 100) break;
    if (page === 20) throw new Error('GitHub pagination incomplete');
  }
  const owned = all.filter(repo => !repo.fork).sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));
  const now = new Date();
  const since = now.getTime() - 30 * 86400000;
  let readinessComplete = true;
  const repositories: PortfolioRepository[] = [];
  // Bounded concurrency; website URLs are display-only, never requested server-side.
  for (let start = 0; start < owned.length; start += 6) {
    repositories.push(...await Promise.all(owned.slice(start, start + 6).map(async repo => {
      const readinessEvidence: NonNullable<PortfolioRepository['readinessEvidence']> = [];
      if ((repo.topics ?? []).includes('production-ready') && !repo.archived) {
        readinessEvidence.push({kind:'topic', label:'Maintainer marked production-ready', url:repo.html_url});
      }
      if (!repo.archived) {
        try {
          const release = await githubFetch<Release>(`/repos/${repo.full_name}/releases/latest`);
          if (release && !release.draft && !release.prerelease && release.published_at) {
            readinessEvidence.push({kind:'release', label:`Stable release ${release.tag_name}`, url:release.html_url});
          }
        } catch { readinessComplete = false; }
      }
      const homepage = publicWebsite(repo.homepage);
      return {
        name:repo.name, fullName:repo.full_name, url:repo.html_url, description:repo.description,
        language:repo.language, topics:repo.topics ?? [], createdAt:repo.created_at,
        pushedAt:repo.pushed_at, updatedAt:repo.updated_at, homepage, liveUrl:homepage,
        stars:repo.stargazers_count, forks:repo.forks_count, defaultBranch:repo.default_branch,
        isArchived:repo.archived, isHosted:Boolean(homepage), isProductionReady:readinessEvidence.length > 0,
        readinessEvidence,
      };
    })));
  }
  const latest = repositories.find(repo => !repo.isArchived);
  const currentRepo = latest ? {
    ...latest, languages:latest.language ? [latest.language] : [], visibility:'public',
    activityStatus:Date.parse(latest.pushedAt ?? '') >= since ? 'active' : 'quiet',
    statusLabel:'latest push', statusTone:'cyan', latestCommit:null,
  } : null;
  if (currentRepo) {
    try {
      const commits = await githubFetch<Array<{sha:string; html_url:string; commit:{message:string; author:{date:string; name:string}}; author?:{login:string}}>>(`/repos/${currentRepo.fullName}/commits?per_page=1`);
      const commit = commits?.[0];
      if (commit) Object.assign(currentRepo, {latestCommit:{sha:commit.sha.slice(0,7),url:commit.html_url,message:commit.commit.message.split('\n')[0],authoredAt:commit.commit.author.date,author:commit.author?.login ?? commit.commit.author.name}});
    } catch { /* The latest push remains valid without commit detail. */ }
  }
  return {
    username:USERNAME, repositoryCount:all.length, commitCount:0, languages:{}, currentRepo,
    recentRepos:repositories.slice(0,8), recentActivity:[], syncedAt:now.toISOString(), dataStatus:'synced',
    contributionData:{schemaVersion:2, currentRepo, repositories,
      totalStars:owned.reduce((sum,r)=>sum+r.stargazers_count,0),
      totalForks:owned.reduce((sum,r)=>sum+r.forks_count,0),
      technologies:[...new Set(owned.map(r=>r.language).filter((v):v is string=>Boolean(v)))],
      stats:{publicRepositories:all.length, createdRepositories:owned.length,
        activeRepositories:owned.filter(r=>!r.archived && Date.parse(r.pushed_at)>=since).length,
        newRepositories:owned.filter(r=>Date.parse(r.created_at)>=since).length,
        hostedProjects:repositories.filter(r=>r.isHosted).length,
        productionReadyProjects:repositories.filter(r=>r.isProductionReady).length},
      provenance:{sourceUrl:`https://github.com/${USERNAME}?tab=repositories`,syncedAt:now.toISOString(),activityWindowDays:30,
        hostedDefinition:'Repositories with a public website URL in GitHub. Availability is not checked.',
        productionReadyDefinition:'A stable GitHub release or an explicit production-ready topic. These are maintainer signals, not a production audit.',readinessComplete},
    },
  };
}, ['public-github-portfolio-v1'], { revalidate:3600 });

export async function getPublicGithub(): Promise<GithubSummary | null> {
  try { return await loadPublicGithub(); }
  catch { return null; }
}
