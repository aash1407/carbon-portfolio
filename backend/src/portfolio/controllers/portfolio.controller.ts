import { Body, Controller, Post } from '@nestjs/common';
import { PortfolioService } from '../services/portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Post()
  async generatePortfolio(@Body() body: { requestedTons: number }) {
    return this.portfolioService.generatePortfolio(body.requestedTons);
  }
}
