import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createArticleDto: CreateArticleDto) {
    return new ArticleEntity(
      await this.prisma.article.create({ data: createArticleDto }),
    );
    // return this.prisma.article.create({ data: createArticleDto });
  }

  async findAll() {
    const articles = await this.prisma.article.findMany({
      where: { published: true },
    });
    return articles.map((article) => new ArticleEntity(article));
    // return this.prisma.article.findMany({ where: { published: true } });
  }

  async findAllDrafts() {
    const drafts = await this.prisma.article.findMany({
      where: { published: false },
    });
    return drafts.map((draft) => new ArticleEntity(draft));
    // return this.prisma.article.findMany({ where: { published: false } });
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return new ArticleEntity(article);
    // return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
    return new ArticleEntity(article);
    // return this.prisma.article.update({
    //   where: { id },
    //   data: updateArticleDto,
    // });
  }

  async remove(id: number) {
    return new ArticleEntity(
      await this.prisma.article.delete({ where: { id } }),
    );
    // return this.prisma.article.delete({ where: { id } });
  }
}
