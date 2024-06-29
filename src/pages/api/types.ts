type SharePrice = {
  dateTime: Date;
  price: number;
};

type StockVolatility = {
  annualVolatility: number;
  dailyVolatility: number;
  isSufficientDataPresent: boolean;
  totalDaysCompared: number;
};

type Snowflake = {
  overallScore: number;
  description: string | null;
};

type StockResponse = {
  companyName: string;
  symbol: string;
  exchangeSymbol: string;
  uniqueSymbol: string;
  latestPrice: number;
  sharePrices?: SharePrice[];
  stockVolatility: StockVolatility;
  snowflake: Snowflake;
};

type Meta = {
  version: number;
  offset: number;
  limit: number;
  totalStockCount: number;
};

type StocksAPIResponse = {
  meta: Meta;
  stocks: StockResponse[];
};

export type { StocksAPIResponse, Meta, StockResponse, SharePrice, Snowflake, StockVolatility };
