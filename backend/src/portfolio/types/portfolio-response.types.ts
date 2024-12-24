import { PortfolioItem } from './portfolio-item.types';

export type PortfolioResponse = {
  allocatedTons: number;
  totalPrice: number;
  unallocatedTons: number;
  portfolio: PortfolioItem[];
};
