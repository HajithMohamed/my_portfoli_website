import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlogPostDto } from './dto/blog-post.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  publicPosts() {
    return this.prisma.blogPost.findMany({
      where: { status: BlogStatus.PUBLISHED },
      include: { tags: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  adminPosts() {
    return this.prisma.blogPost.findMany({
      include: { tags: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findBySlug(slug: string, includeDrafts = false) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { tags: true },
    });
    if (!post || (!includeDrafts && post.status !== BlogStatus.PUBLISHED)) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  create(dto: BlogPostDto) {
    const status = dto.status ?? BlogStatus.DRAFT;
    return this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: dto.coverImage,
        status,
        publishedAt: status === BlogStatus.PUBLISHED ? new Date() : undefined,
        tags: this.tags(dto.tags),
      },
      include: { tags: true },
    });
  }

  async update(id: string, dto: Partial<BlogPostDto>) {
    await this.ensure(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...this.blogFields(dto),
        ...(dto.status === BlogStatus.PUBLISHED
          ? { publishedAt: new Date() }
          : {}),
        ...(dto.tags ? { tags: { set: [], ...this.tags(dto.tags) } } : {}),
      },
      include: { tags: true },
    });
  }

  async remove(id: string) {
    await this.ensure(id);
    await this.prisma.blogPost.delete({ where: { id } });
    return { ok: true };
  }

  private blogFields(dto: Partial<BlogPostDto>) {
    return {
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImage: dto.coverImage,
      status: dto.status,
    };
  }

  private tags(tags: string[] = []) {
    return {
      connectOrCreate: tags.map((name) => ({
        where: { slug: this.slugify(name) },
        create: { name, slug: this.slugify(name) },
      })),
    };
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async ensure(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
  }
}
