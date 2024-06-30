type PaginatedStocksRequest = {
  volatilityPeriodInDays?: number | null;
  priceHistoryLimit?: number | null;
  offset?: number | null;
  limit?: number | null;
};

type SharePrice = {
  dateTime: Date;
  price: number;
};

type Snowflake = {
  overallScore: number;
  description: string | null;
  value: number;
  future: number;
  past: number;
  health: number;
  dividend: number;
};

type Stock = {
  companyName: string;
  symbol: string;
  exchangeSymbol: string;
  uniqueSymbol: string;
  latestPrice: number;
  sharePrices: SharePrice[];
  stockVolatility: StockVolatilityScore;
  snowflake: Snowflake;
};

type PaginatedStocksResponse = {
  limit: number;
  offset: number;
  totalStockCount: number;
  stocks: Stock[];
};

type StockVolatilityScore = {
  annualVolatility: number;
  dailyVolatility: number;
  isSufficientDataPresent: boolean;
  totalDaysCompared: number;
};

export type {
  PaginatedStocksRequest,
  PaginatedStocksResponse,
  Stock,
  SharePrice,
  Snowflake,
  StockVolatilityScore,
};
