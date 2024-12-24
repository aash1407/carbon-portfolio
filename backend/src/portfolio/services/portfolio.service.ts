import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from '../../project/services/project.service';
import { PortfolioItem, PortfolioResponse } from '../types';
import { Project } from '@prisma/client';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(private projectService: ProjectService) {}

  async generatePortfolio(requestedTons: number): Promise<PortfolioResponse> {
    if (requestedTons <= 0) {
      this.logger.error('Requested tons should be greater than 0');
      throw new BadRequestException('Requested tons should be greater than 0');
    }

    let projects: Project[];
    try {
      projects = await this.projectService.getProjects();
    } catch (error) {
      this.logger.error('Error fetching projects from the db', error);
      throw new InternalServerErrorException(
        'Error fetching projects from the db',
      );
    }

    if (!projects || projects.length === 0) {
      this.logger.warn('No projects found in the db');
      throw new NotFoundException('No projects found in the db');
    }

    const totalDistributionWeight = projects.reduce(
      (acc, project) => acc + project.distributionWeight,
      0,
    );

    if (totalDistributionWeight === 0) {
      this.logger.error(
        'Total distribution weight is 0. Unable to generate portfolio',
      );
      throw new InternalServerErrorException(
        'Total distribution weight is 0. Unable to generate portfolio',
      );
    }

    // Note: Sum of the distribution weights can't be 1 all the time, so it's better to normalize
    const projectsWithNormalizedWeights = projects.map((project: Project) => ({
      ...project,
      normalizedWeight: project.distributionWeight / totalDistributionWeight,
    }));

    let remainingTons = requestedTons;
    let allocatedTons = 0;
    let totalPrice = 0;
    const portfolio: PortfolioItem[] = [];

    for (const project of projectsWithNormalizedWeights) {
      const maxForProject = Math.floor(
        project.normalizedWeight * requestedTons,
      );

      const allocatedTonsForProject = Math.min(
        maxForProject,
        project.offeredVolume,
      );

      portfolio.push({
        projectId: project.id,
        name: project.name,
        country: project.country,
        image: project.image,
        allocatedTons: allocatedTonsForProject,
        price: allocatedTonsForProject * project.pricePerTon,
      });

      remainingTons -= allocatedTonsForProject;
      allocatedTons += allocatedTonsForProject;
      totalPrice += allocatedTonsForProject * project.pricePerTon;

      if (remainingTons <= 0) break;
    }
    this.logger.log('--**Portfolio generated successfully**--');
    return {
      allocatedTons,
      totalPrice,
      unallocatedTons: remainingTons,
      portfolio,
    };
  }
}
