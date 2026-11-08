import { NotFoundException } from '@nestjs/common';
import { ProjectStatus, SuggestionStatus } from '@prisma/client';
import {
  githubRepo,
  README_SOURCE,
  ReadmeRecord,
  ReadmeSyncService,
} from './readme-sync.service';

const README_V1 =
  '# BenchBook\n\nBenchBook gives every laboratory one live schedule for shared instruments, rooms and transport vans. Bookings never clash.\n';
const README_V2 =
  '# BenchBook\n\nBenchBook gives every laboratory one live schedule for shared instruments and rooms, with clash-free bookings enforced by PostgreSQL.\n';

function readmeResponse(markdown: string, sha: string, etag = `"etag-${sha}"`) {
  return new Response(
    JSON.stringify({
      sha,
      path: 'README.md',
      html_url:
        'https://github.com/HajithMohamed/BenchBook/blob/develop/README.md',
      content: Buffer.from(markdown).toString('base64'),
      encoding: 'base64',
    }),
    { status: 200, headers: { etag } },
  );
}

function record(fields: Partial<ReadmeRecord> = {}): ReadmeRecord {
  return {
    kind: 'baseline',
    projectId: 'p1',
    slug: 'benchbook',
    title: 'BenchBook',
    repo: 'HajithMohamed/BenchBook',
    path: 'README.md',
    sha: 'sha-1',
    etag: '"etag-sha-1"',
    htmlUrl:
      'https://github.com/HajithMohamed/BenchBook/blob/develop/README.md',
    summary: 'Old summary.',
    sections: [],
    previousSha: null,
    previousSummary: null,
    commit: null,
    detectedAt: '2026-11-01T00:00:00.000Z',
    ...fields,
  };
}

describe('ReadmeSyncService', () => {
  const prisma = {
    project: { findMany: jest.fn() },
    syncSuggestion: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  const config = { get: jest.fn() };
  const fetchMock = jest.fn();
  const service = new ReadmeSyncService(prisma as never, config as never);
  /** Typed views of mock calls (jest records them as `any`). */
  const fetchCall = (index: number) => {
    const [url, init] = fetchMock.mock.calls[index] as [
      string,
      { headers: Record<string, string> },
    ];
    return { url, headers: init.headers };
  };
  const createdRow = () =>
    (
      prisma.syncSuggestion.create.mock.calls[0] as [
        {
          data: {
            source: string;
            status: SuggestionStatus;
            title: string;
            payload: Record<string, unknown>;
          };
        },
      ]
    )[0].data;
  const objectContaining = (value: Record<string, unknown>): unknown =>
    expect.objectContaining(value);

  const project = {
    id: 'p1',
    slug: 'benchbook',
    title: 'BenchBook',
    githubUrl: 'https://github.com/HajithMohamed/BenchBook',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock as never;
    config.get.mockReturnValue(undefined);
    prisma.project.findMany.mockResolvedValue([project]);
    prisma.syncSuggestion.findMany.mockResolvedValue([]);
  });

  it('checks only published projects that link a repository', async () => {
    fetchMock.mockResolvedValue(readmeResponse(README_V1, 'sha-1'));
    await service.sync();
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: ProjectStatus.ACTIVE, githubUrl: { not: null } },
      }),
    );
    expect(fetchCall(0).url).toBe(
      'https://api.github.com/repos/HajithMohamed/BenchBook/readme',
    );
  });

  it('records the first README it sees as an acknowledged baseline, without a notice', async () => {
    fetchMock.mockResolvedValue(readmeResponse(README_V1, 'sha-1'));
    const report = await service.sync();

    expect(report).toMatchObject({ checked: 1, changed: 0, failed: 0 });
    expect(report.results[0]).toMatchObject({
      status: 'baseline',
      repo: 'HajithMohamed/BenchBook',
    });
    const data = createdRow();
    expect(data).toMatchObject({
      source: README_SOURCE,
      status: SuggestionStatus.APPROVED,
      title: 'README synced: BenchBook',
    });
    expect(data.payload).toMatchObject({
      kind: 'baseline',
      sha: 'sha-1',
      etag: '"etag-sha-1"',
      summary:
        'BenchBook gives every laboratory one live schedule for shared instruments, rooms and transport vans. Bookings never clash.',
    });
  });

  it('creates a pending notice with the commit when a README changes', async () => {
    prisma.syncSuggestion.findMany.mockResolvedValue([
      {
        id: 's1',
        status: SuggestionStatus.APPROVED,
        createdAt: new Date(),
        title: 'README synced: BenchBook',
        payload: record(),
      },
    ]);
    fetchMock
      .mockResolvedValueOnce(readmeResponse(README_V2, 'sha-2'))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              sha: 'c0ffee',
              html_url:
                'https://github.com/HajithMohamed/BenchBook/commit/c0ffee',
              commit: {
                message: 'docs: explain the clash rule\n\nLonger body',
                author: { name: 'Mohamed', date: '2026-11-07T10:00:00Z' },
              },
              author: { login: 'HajithMohamed' },
            },
          ]),
          { status: 200 },
        ),
      );

    const report = await service.sync();

    expect(fetchCall(0).headers['If-None-Match']).toBe('"etag-sha-1"');
    expect(report).toMatchObject({ checked: 1, changed: 1 });
    const data = createdRow();
    expect(data).toMatchObject({
      status: SuggestionStatus.PENDING,
      title: 'README updated: BenchBook',
    });
    expect(data.payload).toMatchObject({
      kind: 'change',
      sha: 'sha-2',
      previousSha: 'sha-1',
      previousSummary: 'Old summary.',
      commit: {
        sha: 'c0ffee',
        message: 'docs: explain the clash rule',
        author: 'HajithMohamed',
      },
    });
  });

  it('treats "304 Not Modified" as unchanged and writes nothing', async () => {
    prisma.syncSuggestion.findMany.mockResolvedValue([
      {
        id: 's1',
        status: SuggestionStatus.APPROVED,
        createdAt: new Date(),
        title: 't',
        payload: record(),
      },
    ]);
    fetchMock.mockResolvedValue(new Response(null, { status: 304 }));

    const report = await service.sync();

    expect(report.results[0].status).toBe('unchanged');
    expect(prisma.syncSuggestion.create).not.toHaveBeenCalled();
    expect(prisma.syncSuggestion.update).not.toHaveBeenCalled();
  });

  it('keeps a fresh ETag when the content is the same', async () => {
    prisma.syncSuggestion.findMany.mockResolvedValue([
      {
        id: 's1',
        status: SuggestionStatus.APPROVED,
        createdAt: new Date(),
        title: 't',
        payload: record(),
      },
    ]);
    fetchMock.mockResolvedValue(
      readmeResponse(README_V1, 'sha-1', '"etag-new"'),
    );

    const report = await service.sync();

    expect(report.results[0].status).toBe('unchanged');
    expect(prisma.syncSuggestion.create).not.toHaveBeenCalled();
    expect(prisma.syncSuggestion.update).toHaveBeenCalledWith({
      where: { id: 's1' },
      data: {
        payload: objectContaining({ etag: '"etag-new"', sha: 'sha-1' }),
      },
    });
  });

  it('reports missing READMEs, rate limits and non-GitHub links without failing the run', async () => {
    prisma.project.findMany.mockResolvedValue([
      project,
      {
        ...project,
        id: 'p2',
        slug: 'two',
        githubUrl: 'https://github.com/HajithMohamed/Two',
      },
      {
        ...project,
        id: 'p3',
        slug: 'three',
        githubUrl: 'https://gitlab.com/someone/three',
      },
    ]);
    fetchMock.mockImplementation((url: string) =>
      Promise.resolve(
        url.includes('/BenchBook/')
          ? new Response(null, { status: 404 })
          : new Response('{}', {
              status: 403,
              headers: { 'x-ratelimit-remaining': '0' },
            }),
      ),
    );

    const report = await service.sync();

    expect(report.results.map((result) => result.status)).toEqual([
      'missing',
      'error',
      'skipped',
    ]);
    expect(report.results[1].message).toMatch(/rate limit/);
    expect(report).toMatchObject({ checked: 3, failed: 1 });
  });

  it('attaches the latest README to projects and marks real changes', async () => {
    prisma.syncSuggestion.findMany.mockResolvedValue([
      {
        id: 's2',
        status: SuggestionStatus.PENDING,
        createdAt: new Date(),
        title: 't',
        payload: record({
          kind: 'change',
          sha: 'sha-2',
          summary: 'New summary.',
          detectedAt: '2026-11-08T00:00:00.000Z',
        }),
      },
      {
        id: 's1',
        status: SuggestionStatus.APPROVED,
        createdAt: new Date(),
        title: 't',
        payload: record(),
      },
    ]);

    const [withReadme, without] = await service.attach([
      { id: 'p1' },
      { id: 'p9' },
    ]);

    expect(withReadme.readme).toMatchObject({
      summary: 'New summary.',
      sha: 'sha-2',
      changedAt: '2026-11-08T00:00:00.000Z',
    });
    expect(without.readme).toBeNull();
  });

  it('never breaks the projects API when README data cannot be read', async () => {
    prisma.syncSuggestion.findMany.mockRejectedValue(
      new Error('database unavailable'),
    );
    await expect(service.attach([{ id: 'p1' }])).resolves.toEqual([
      { id: 'p1', readme: null },
    ]);
  });

  it('lists pending change notices and acknowledges them', async () => {
    prisma.syncSuggestion.findMany.mockResolvedValue([
      {
        id: 's2',
        status: SuggestionStatus.PENDING,
        createdAt: new Date(),
        title: 'README updated: BenchBook',
        payload: record({ kind: 'change' }),
      },
      {
        id: 's1',
        status: SuggestionStatus.APPROVED,
        createdAt: new Date(),
        title: 'README synced: BenchBook',
        payload: record(),
      },
    ]);
    const updates = await service.updates();
    expect(updates.pending.map((update) => update.id)).toEqual(['s2']);
    expect(updates.recent).toEqual([]);

    prisma.syncSuggestion.findFirst.mockResolvedValue({ id: 's2' });
    await expect(service.acknowledge('s2')).resolves.toEqual({ ok: true });
    expect(prisma.syncSuggestion.update).toHaveBeenCalledWith({
      where: { id: 's2' },
      data: { status: SuggestionStatus.APPROVED },
    });

    prisma.syncSuggestion.findFirst.mockResolvedValue(null);
    await expect(service.acknowledge('other')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('githubRepo', () => {
  it.each([
    [
      'https://github.com/akalanka001/-BloodBridge--ADBMS',
      'akalanka001/-BloodBridge--ADBMS',
    ],
    [
      'https://www.github.com/HajithMohamed/Tech_Bridge.git',
      'HajithMohamed/Tech_Bridge',
    ],
    [
      'https://github.com/HajithMohamed/Tech_Bridge/tree/main/docs',
      'HajithMohamed/Tech_Bridge',
    ],
    ['https://github.com/HajithMohamed', null],
    ['https://gitlab.com/someone/repo', null],
    ['not a url', null],
    [null, null],
  ])('%s -> %s', (url, expected) => {
    expect(githubRepo(url)).toBe(expected);
  });
});
