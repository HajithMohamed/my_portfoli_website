import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BlogsService } from './blogs.service';
import { BlogPostDto } from './dto/blog-post.dto';

@ApiTags('Blogs')
@Controller()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get('blogs')
  publicPosts() {
    return this.blogsService.publicPosts();
  }

  @Get('blogs/:slug')
  publicBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  @Get('admin/blogs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  adminPosts() {
    return this.blogsService.adminPosts();
  }

  @Get('admin/blogs/:slug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  adminBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug, true);
  }

  @Post('admin/blogs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: BlogPostDto) {
    return this.blogsService.create(dto);
  }

  @Patch('admin/blogs/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: Partial<BlogPostDto>) {
    return this.blogsService.update(id, dto);
  }

  @Delete('admin/blogs/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
