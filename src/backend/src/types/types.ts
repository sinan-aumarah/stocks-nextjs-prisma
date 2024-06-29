export interface PaginatedStocksRequest {
  numberOfDaysForVolatilityCalculation: number;
  priceHistoryLimit: number;
  offset: number | null;
  limit: number | null;
}
