import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(private projectRepository: ProjectRepository) {}

  async getProjects() {
    try {
      const projects = await this.projectRepository.findAll();
      if (!projects || projects.length === 0) {
        this.logger.warn('No projects Found');
      }
      return projects;
    } catch (error) {
      this.logger.error('ERror fetching projects -->', error);
      throw new InternalServerErrorException('ERror fetching projects');
    }
  }

  async createProject(project: Project) {
    try {
      const createdProject = await this.projectRepository.create(project);
      this.logger.log(
        `Project created: ${createdProject.name} id: ${createdProject.id}`,
      );
      return createdProject;
    } catch (error) {
      this.logger.error('Error creating project --', error);
      throw new InternalServerErrorException('Error creating project');
    }
  }

  async updateProject(id: number, project: Project) {
    try {
      const existingProject = await this.projectRepository.findById(id);
      if (!existingProject) {
        this.logger.warn(`Project with id ${id} not found.`);
        throw new NotFoundException(`Project with id ${id} not found`);
      }

      const updatedProject = await this.projectRepository.update(id, project);
      this.logger.log(`Project updated: ${updatedProject.name}`);
      return updatedProject;
    } catch (error) {
      this.logger.error('Error updating project -->', error);
      throw new InternalServerErrorException('Error updating project');
    }
  }

  async deleteProject(id: number) {
    try {
      const existingProject = await this.projectRepository.findById(id);
      if (!existingProject) {
        this.logger.warn(`Project with id ${id} not found`);
        throw new NotFoundException(`Project with id ${id} not found`);
      }

      await this.projectRepository.remove(id);
      this.logger.log(`Project with id ${id} DEleted successfully`);
    } catch (error) {
      this.logger.error('Error deleting project -->', error);
      throw new InternalServerErrorException('Error deleting project');
    }
  }
}
