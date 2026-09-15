import { GithubService } from './github.service';
import { GithubRepo } from './github-facts';

type SnapshotInput = {
  repositoryCount: number;
  contributionData: {
    stats: Record<string, number>;
    repositories: {
      goal: string | null;
      readinessChecked: boolean;
      isProductionReady: boolean;
    }[];
    provenance: { readinessComplete: boolean };
  };
};

function fetchInputUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

describe('GithubService sync', () => {
  afterEach(() => jest.restoreAllMocks());

  it('paginates owner repositories, ignores the old pin, protects private data, and enriches source suggestions', async () => {
    const base: GithubRepo = {
      name: 'first',
      full_name: 'HajithMohamed/first',
      html_url: 'https://github.com/HajithMohamed/first',
      description: 'A public repository',
      language: 'TypeScript',
      created_at: '2026-09-01T00:00:00Z',
      pushed_at: '2026-09-01T00:00:00Z',
      homepage: null,
      fork: false,
      stargazers_count: 0,
      forks_count: 0,
      private: false,
    };
    const firstPage: GithubRepo[] = [
      base,
      ...Array.from({ length: 97 }, (_, i) => ({
        ...base,
        name: `fork${i}`,
        full_name: `HajithMohamed/fork${i}`,
        fork: true,
      })),
      {
        ...base,
        name: 'secret',
        full_name: 'HajithMohamed/secret',
        private: true,
      },
      { ...base, full_name: 'someone-else/work' },
    ];
    const second = {
      ...base,
      name: 'current',
      full_name: 'HajithMohamed/current',
      html_url: 'https://github.com/HajithMohamed/current',
      homepage: 'https://current.vercel.app',
      pushed_at: '2026-09-09T00:00:00Z',
    };
    let createdData: SnapshotInput | undefined;
    let suggestionData: unknown[] = [];
    const prisma = {
      githubSnapshot: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockImplementation(({ data }: { data: SnapshotInput }) => {
            createdData = data;
            return Promise.resolve({ ...data, syncedAt: new Date() });
          }),
      },
      syncSuggestion: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ payload: { fullName: second.full_name } }]),
        createMany: jest
          .fn()
          .mockImplementation(({ data }: { data: unknown[] }) => {
            suggestionData = data;
            return Promise.resolve({ count: data.length });
          }),
      },
    };
    const config = {
      get: (key: string) =>
        ({
          GITHUB_USERNAME: 'HajithMohamed',
          GITHUB_TOKEN: 'test-only-token',
          GITHUB_CURRENT_REPO: 'secret',
        })[key],
    };
    const requested: string[] = [];
    jest.spyOn(global, 'fetch').mockImplementation((input) => {
      const url = fetchInputUrl(input);
      requested.push(url);
      const json = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        });
      if (url.includes('/users/HajithMohamed/repos?'))
        return Promise.resolve(
          json(url.includes('page=2') ? [second] : firstPage),
        );
      if (url.endsWith('/graphql')) return Promise.resolve(json({ data: {} }));
      if (url.includes('/events/public')) return Promise.resolve(json([]));
      if (url.endsWith('/users/HajithMohamed'))
        return Promise.resolve(json({ followers: 2, following: 3 }));
      if (url.endsWith('/languages'))
        return Promise.resolve(json({ TypeScript: 100 }));
      if (url.includes('/commits?')) return Promise.resolve(json([]));
      if (url.endsWith('/releases/latest'))
        return Promise.resolve(json({}, 404));
      if (url.endsWith('/readme'))
        return Promise.resolve(
          new Response(
            '# Project\n\n## Goal\nHelp people organize their research and project work in one place.',
          ),
        );
      return Promise.reject(new Error(`Unexpected request ${url}`));
    });
    const service = new GithubService(prisma as never, config as never);
    const snapshot = await service.sync();
    expect(requested.some((url) => url.includes('per_page=100&page=2'))).toBe(
      true,
    );
    expect(
      requested.some(
        (url) =>
          url.includes('/secret/') ||
          url.includes('/someone-else/') ||
          url.includes('/HajithMohamed/fork'),
      ),
    ).toBe(false);
    expect(snapshot?.repositoryCount).toBe(2);
    expect(snapshot?.currentRepo?.name).toBe('current');
    if (!createdData) throw new Error('Expected a GitHub snapshot');
    const data = createdData;
    expect(data.contributionData.stats.publicRepositories).toBe(2);
    expect(data.contributionData.stats.hostedProjects).toBe(1);
    expect(data.contributionData.repositories[0].goal).toContain(
      'organize their research',
    );
    expect(
      data.contributionData.repositories.every((repo) => repo.readinessChecked),
    ).toBe(true);
    expect(suggestionData).toHaveLength(1);
  });

  it('does not label release lookup failures as a completed readiness check', async () => {
    const repo: GithubRepo = {
      name: 'work',
      full_name: 'HajithMohamed/work',
      html_url: 'https://github.com/HajithMohamed/work',
      description: 'A project',
      language: null,
      pushed_at: '2026-09-01T00:00:00Z',
      homepage: null,
      fork: false,
      stargazers_count: 0,
      forks_count: 0,
    };
    let createdData: SnapshotInput | undefined;
    const prisma = {
      githubSnapshot: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockImplementation(({ data }: { data: SnapshotInput }) => {
            createdData = data;
            return Promise.resolve(data);
          }),
      },
      syncSuggestion: {
        findMany: jest.fn().mockResolvedValue([]),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    jest.spyOn(global, 'fetch').mockImplementation((input) => {
      const url = fetchInputUrl(input);
      if (url.includes('/users/HajithMohamed/repos?'))
        return Promise.resolve(new Response(JSON.stringify([repo])));
      if (url.endsWith('/releases/latest') || url.endsWith('/readme'))
        return Promise.resolve(new Response('{}', { status: 403 }));
      if (url.includes('/events/') || url.includes('/commits?'))
        return Promise.resolve(new Response('[]'));
      return Promise.resolve(new Response('{}'));
    });
    const service = new GithubService(
      prisma as never,
      { get: () => undefined } as never,
    );
    await service.sync();
    if (!createdData) throw new Error('Expected a GitHub snapshot');
    const data = createdData;
    expect(data.contributionData.provenance.readinessComplete).toBe(false);
    expect(data.contributionData.repositories[0].readinessChecked).toBe(false);
    expect(data.contributionData.repositories[0].isProductionReady).toBe(false);
  });
});
