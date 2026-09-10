import { GithubService } from './github.service';
import { GithubRepo } from './github-facts';

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
    const prisma = {
      githubSnapshot: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({ ...data, syncedAt: new Date() }),
          ),
      },
      syncSuggestion: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ payload: { fullName: second.full_name } }]),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
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
    jest.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      requested.push(url);
      const json = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        });
      if (url.includes('/users/HajithMohamed/repos?'))
        return json(url.includes('page=2') ? [second] : firstPage);
      if (url.endsWith('/graphql')) return json({ data: {} });
      if (url.includes('/events/public')) return json([]);
      if (url.endsWith('/users/HajithMohamed'))
        return json({ followers: 2, following: 3 });
      if (url.endsWith('/languages')) return json({ TypeScript: 100 });
      if (url.includes('/commits?')) return json([]);
      if (url.endsWith('/releases/latest')) return json({}, 404);
      if (url.endsWith('/readme'))
        return new Response(
          '# Project\n\n## Goal\nHelp people organize their research and project work in one place.',
        );
      throw new Error(`Unexpected request ${url}`);
    });
    const service = new GithubService(prisma as never, config as never);
    const snapshot = await service.sync();
    expect(requested.some((url) => url.includes('per_page=100&page=2'))).toBe(
      true,
    );
    expect(
      requested.some(
        (url) => url.includes('/secret/') || url.includes('/someone-else/'),
      ),
    ).toBe(false);
    expect(snapshot?.repositoryCount).toBe(2);
    expect(snapshot?.currentRepo?.name).toBe('current');
    const data = prisma.githubSnapshot.create.mock.calls[0][0].data as {
      contributionData: {
        stats: Record<string, number>;
        repositories: { goal: string; readinessChecked: boolean }[];
      };
    };
    expect(data.contributionData.stats.publicRepositories).toBe(99);
    expect(data.contributionData.stats.hostedProjects).toBe(1);
    expect(data.contributionData.repositories[0].goal).toContain(
      'organize their research',
    );
    expect(
      data.contributionData.repositories.every((repo) => repo.readinessChecked),
    ).toBe(true);
    expect(prisma.syncSuggestion.createMany.mock.calls[0][0].data).toHaveLength(
      1,
    );
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
    const prisma = {
      githubSnapshot: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve(data),
          ),
      },
      syncSuggestion: {
        findMany: jest.fn().mockResolvedValue([]),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    jest.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes('/users/HajithMohamed/repos?'))
        return new Response(JSON.stringify([repo]));
      if (url.endsWith('/releases/latest') || url.endsWith('/readme'))
        return new Response('{}', { status: 403 });
      if (url.includes('/events/') || url.includes('/commits?'))
        return new Response('[]');
      return new Response('{}');
    });
    const service = new GithubService(
      prisma as never,
      { get: () => undefined } as never,
    );
    await service.sync();
    const data = prisma.githubSnapshot.create.mock.calls[0][0].data as {
      contributionData: {
        provenance: { readinessComplete: boolean };
        repositories: {
          readinessChecked: boolean;
          isProductionReady: boolean;
        }[];
      };
    };
    expect(data.contributionData.provenance.readinessComplete).toBe(false);
    expect(data.contributionData.repositories[0].readinessChecked).toBe(false);
    expect(data.contributionData.repositories[0].isProductionReady).toBe(false);
  });
});
