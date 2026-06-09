import { NotFoundException } from '@nestjs/common';
import { SkillsService } from './skills.service';

describe('SkillsService', () => {
  const prisma = {
    skill: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const service = new SkillsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns skills in display order', async () => {
    prisma.skill.findMany.mockResolvedValue([{ name: 'Next.js' }]);
    await expect(service.findAll()).resolves.toEqual([{ name: 'Next.js' }]);
    expect(prisma.skill.findMany).toHaveBeenCalledWith({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    });
  });

  it('throws when updating a missing skill', async () => {
    prisma.skill.findUnique.mockResolvedValue(null);
    await expect(
      service.update('missing', { name: 'React' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
