import { Controller, Get } from '@nestjs/common';
import { ProjectService } from '../services/project.service';

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}
  @Get()
  async getAllProjects() {
    return this.projectService.getProjects();
  }
}
