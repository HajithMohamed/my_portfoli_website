import {
  GithubRepo,
  mostRecentlyPushed,
  publicHomepage,
  publicOwnerRepos,
  repositoryInsight,
  repositoryStats,
} from './github-facts';

const repo = (overrides: Partial<GithubRepo> = {}): GithubRepo => ({
  name: 'portfolio',
  full_name: 'HajithMohamed/portfolio',
  html_url: 'https://github.com/HajithMohamed/portfolio',
  description: 'My portfolio',
  language: 'TypeScript',
  pushed_at: '2026-09-09T00:00:00Z',
  created_at: '2025-01-01T00:00:00Z',
  homepage: null,
  fork: false,
  stargazers_count: 0,
  forks_count: 0,
  private: false,
  visibility: 'public',
  ...overrides,
});

describe('GitHub portfolio facts', () => {
  it('never includes private, internal, or another owner repositories', () => {
    expect(
      publicOwnerRepos(
        [
          repo(),
          repo({ private: true }),
          repo({ visibility: 'internal' }),
          repo({ full_name: 'another-owner/portfolio' }),
        ],
        'hajithmohamed',
      ),
    ).toHaveLength(1);
  });

  it('selects actual latest push and excludes archived work, forks, and private repos', () => {
    const current = repo({
      name: 'current',
      pushed_at: '2026-09-08T00:00:00Z',
    });
    expect(
      mostRecentlyPushed([
        repo({
          name: 'old',
          pushed_at: '2024-01-01T00:00:00Z',
          updated_at: '2026-09-10T00:00:00Z',
        }),
        repo({ fork: true }),
        repo({ archived: true }),
        repo({ private: true }),
        current,
      ])?.name,
    ).toBe('current');
    expect(mostRecentlyPushed([repo({ archived: true })])).toBeNull();
  });

  it.each([
    'javascript:alert(1)',
    'ftp://website.example.org',
    'https://github.com/a/b',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://10.0.0.1',
    'https://example.com',
    'https://user:password@actual-site.com',
    'http://app.internal',
  ])('does not count %s as a hosted project', (homepage) => {
    expect(publicHomepage(homepage)).toBeNull();
  });

  it('counts a valid listed homepage without claiming it is production ready', () => {
    const insight = repositoryInsight(
      repo({ homepage: 'https://my-portfolio.vercel.app' }),
      null,
      true,
    );
    expect(insight.isHosted).toBe(true);
    expect(insight.isProductionReady).toBe(false);
    expect(insight.liveUrl).toBe('https://my-portfolio.vercel.app/');
  });

  it('requires explicit readiness evidence, excludes archived and prerelease repositories', () => {
    expect(
      repositoryInsight(repo({ topics: ['production-ready'] }), null, false)
        .isProductionReady,
    ).toBe(true);
    expect(
      repositoryInsight(
        repo({ topics: ['production-ready'], archived: true }),
        null,
        true,
      ).isProductionReady,
    ).toBe(false);
    const release = {
      tag_name: 'v1.0',
      html_url: 'https://github.com/HajithMohamed/portfolio/releases/tag/v1.0',
      published_at: '2026-09-01T00:00:00Z',
      draft: false,
      prerelease: false,
    };
    expect(repositoryInsight(repo(), release, true).isProductionReady).toBe(
      true,
    );
    expect(
      repositoryInsight(repo(), { ...release, prerelease: true }, true)
        .isProductionReady,
    ).toBe(false);
    expect(
      repositoryInsight(repo(), { ...release, draft: true }, true)
        .isProductionReady,
    ).toBe(false);
    expect(repositoryInsight(repo(), null, false).readinessChecked).toBe(false);
  });

  it('counts public source work with documented thirty-day activity/creation windows', () => {
    const items = [
      repositoryInsight(
        repo({
          homepage: 'https://portfolio.vercel.app',
          topics: ['production-ready'],
        }),
        null,
        true,
      ),
      repositoryInsight(
        repo({
          name: 'new',
          created_at: '2026-09-02T00:00:00Z',
          pushed_at: '2026-09-02T00:00:00Z',
        }),
        null,
        true,
      ),
      repositoryInsight(repo({ name: 'archived', archived: true }), null, true),
      repositoryInsight(
        repo({ name: 'old', pushed_at: '2024-01-01T00:00:00Z' }),
        null,
        true,
      ),
    ];
    expect(
      repositoryStats(items, 5, Date.parse('2026-09-10T00:00:00Z')),
    ).toEqual({
      publicRepositories: 5,
      createdRepositories: 4,
      activeRepositories: 2,
      newRepositories: 1,
      hostedProjects: 1,
      productionReadyProjects: 1,
    });
  });
});
