import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PortfolioService } from '../../src/portfolio/services/portfolio.service';
import { ProjectService } from '../../src/project/services/project.service';

describe('PortfolioService', () => {
  let portfolioService: PortfolioService;
  let projectService: ProjectService;

  const mockProjects = [
    {
      id: 1,
      name: 'Project A',
      country: 'Country A',
      image: 'imageA.jpg',
      distributionWeight: 0.4,
      offeredVolume: 1000,
      pricePerTon: 10,
    },
    {
      id: 2,
      name: 'Project B',
      country: 'Country B',
      image: 'imageB.jpg',
      distributionWeight: 0.6,
      offeredVolume: 1500,
      pricePerTon: 20,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: ProjectService,
          useValue: {
            getProjects: jest.fn().mockResolvedValue(mockProjects),
          },
        },
      ],
    }).compile();

    portfolioService = module.get<PortfolioService>(PortfolioService);
    projectService = module.get<ProjectService>(ProjectService);
  });

  it('should generate portfolio successfully', async () => {
    const requestedTons = 1000;
    const result = await portfolioService.generatePortfolio(requestedTons);

    expect(result.allocatedTons).toBe(1000);

    expect(result.totalPrice).toBe(16000);

    expect(result.unallocatedTons).toBe(0);

    expect(result.portfolio.length).toBe(2);

    expect(result.portfolio[0].projectId).toBe(1);
    expect(result.portfolio[1].projectId).toBe(2);
    expect(result.portfolio[0].allocatedTons).toBe(400);
    expect(result.portfolio[1].allocatedTons).toBe(600);

    expect(result.portfolio[0].price).toBe(4000);
    expect(result.portfolio[1].price).toBe(12000);
  });

  it('should throw BadRequestException when requestedTons is less than or equal to 0', async () => {
    const requestedTons = 0;
    await expect(
      portfolioService.generatePortfolio(requestedTons),
    ).rejects.toThrow(
      new BadRequestException('Requested tons must be greater than 0.'),
    );
  });

  it('should throw NotFoundException when no projects are found in the database', async () => {
    const requestedTons = 1000;
    projectService.getProjects = jest.fn().mockResolvedValue([]);
    await expect(
      portfolioService.generatePortfolio(requestedTons),
    ).rejects.toThrow(
      new NotFoundException('No projects found in the database.'),
    );
  });

  it('should throw InternalServerErrorException when total distribution weight is zero', async () => {
    const requestedTons = 1000;
    const mockZeroWeightProjects = [
      {
        id: 1,
        name: 'Project A',
        country: 'Country A',
        image: 'imageA.jpg',
        distributionWeight: 0,
        offeredVolume: 1000,
        pricePerTon: 10,
      },
      {
        id: 2,
        name: 'Project B',
        country: 'Country B',
        image: 'imageB.jpg',
        distributionWeight: 0,
        offeredVolume: 1500,
        pricePerTon: 20,
      },
    ];
    projectService.getProjects = jest
      .fn()
      .mockResolvedValue(mockZeroWeightProjects);
    await expect(
      portfolioService.generatePortfolio(requestedTons),
    ).rejects.toThrow(
      new InternalServerErrorException(
        'Total distribution weight is zero. Unable to generate portfolio.',
      ),
    );
  });

  it('should throw InternalServerErrorException when error occurs while fetching projects', async () => {
    const requestedTons = 1000;
    projectService.getProjects = jest
      .fn()
      .mockRejectedValue(new Error('Database connection error'));
    await expect(
      portfolioService.generatePortfolio(requestedTons),
    ).rejects.toThrow(
      new InternalServerErrorException(
        'Error fetching projects from the database.',
      ),
    );
  });
});
