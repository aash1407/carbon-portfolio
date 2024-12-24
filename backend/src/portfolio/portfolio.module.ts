import { Module } from '@nestjs/common';
import { PortfolioService } from './services/portfolio.service';
import { PortfolioController } from './controllers/portfolio.controller';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [ProjectModule],
  controllers: [PortfolioController],
  exports: [PortfolioService],
  providers: [PortfolioService],
})
export class PortfolioModule {}
