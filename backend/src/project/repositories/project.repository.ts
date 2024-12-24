import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Project } from '@prisma/client';
@Injectable()
export class ProjectRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.project.findMany();
  }

  async create(project: Project) {
    return this.prismaService.project.create({ data: project });
  }

  async findById(id: number) {
    return this.prismaService.project.findUnique({ where: { id } });
  }

  async update(id: number, project: Project) {
    return this.prismaService.project.update({ where: { id }, data: project });
  }

  async remove(id: number) {
    return this.prismaService.project.delete({ where: { id } });
  }
}
