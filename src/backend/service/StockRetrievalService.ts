import { swsCompanyPriceClose } from "@prisma/client";

import StockVolatilityService from "@/src/backend/service/StockVolatilityService";
import {
  PaginatedStocksRequest,
  PaginatedStocksResponse,
  StockVolatilityScore,
} from "@/src/backend/types/types";
import StockRepository from "@/src/backend/dao/StockRepository";

class StockRetrievalService {
  // one year worth of share prices
  private readonly maxNumberOfPriceHistory = 252;
  private readonly maxCompaniesLimit = 1000;
  private readonly defaultCompaniesPerRequestLimit = 100;

  private stockVolatilityService: StockVolatilityService;
  private stockDao: StockRepository;

  constructor(
    stockRepository: StockRepository = new StockRepository(),
    stockVolatilityService: StockVolatilityService = new StockVolatilityService(),
  ) {
    this.stockVolatilityService = stockVolatilityService;
    this.stockDao = stockRepository;
  }

  async getStocksPaginated({
    volatilityPeriodInDays,
    priceHistoryLimit,
    limit,
    offset,
  }: PaginatedStocksRequest): Promise<PaginatedStocksResponse> {
    const maxPriceHistory = Math.min(
      priceHistoryLimit || this.maxNumberOfPriceHistory,
      this.maxNumberOfPriceHistory,
    );
    const actualLimit = Math.min(limit || this.defaultCompaniesPerRequestLimit, this.maxCompaniesLimit);
    const actualOffset = offset || 0;
    const { companiesWithPriceHistory, totalStockCount } = await this.stockDao.doGet(
      actualLimit,
      actualOffset,
      this.maxNumberOfPriceHistory,
    );

    return {
      limit: actualLimit,
      offset: actualOffset,
      totalStockCount: totalStockCount,
      stocks: companiesWithPriceHistory.map((dbCompany) => {
        const sharePricesSortedByLatestToOldest = dbCompany.swsCompanyPriceClose;

        return {
          companyName: dbCompany.name,
          symbol: dbCompany.ticker_symbol,
          exchangeSymbol: dbCompany.exchange_symbol,
          uniqueSymbol: dbCompany.unique_symbol,
          latestPrice: sharePricesSortedByLatestToOldest[0].price,
          sharePrices: this.getSharePrices(sharePricesSortedByLatestToOldest, maxPriceHistory),
          stockVolatility: this.getStockVolatility(sharePricesSortedByLatestToOldest, volatilityPeriodInDays),
          snowflake: {
            overallScore: dbCompany.swsCompanyScore.total,
            description: dbCompany.swsCompanyScore.sentence,
            value: dbCompany.swsCompanyScore.value,
            future: dbCompany.swsCompanyScore.future,
            past: dbCompany.swsCompanyScore.past,
            health: dbCompany.swsCompanyScore.health,
            dividend: dbCompany.swsCompanyScore.dividend,
          },
        };
      }),
    };
  }

  private getSharePrices(sharePricesSortedByLatestToOldest: swsCompanyPriceClose[], maxPriceHistory: number) {
    return sharePricesSortedByLatestToOldest.slice(0, maxPriceHistory).map((price) => ({
      dateTime: new Date(price.date_created),
      price: price.price,
    }));
  }

  private getStockVolatility(
    sharePricesSortedByDateDescending: swsCompanyPriceClose[],
    volatilityPeriodInDays?: number,
  ): StockVolatilityScore {
    const sharePricesSortedByDateAsc = sharePricesSortedByDateDescending.slice().reverse();

    return this.stockVolatilityService.calculateVolatility(
      sharePricesSortedByDateAsc,
      volatilityPeriodInDays || 0,
    );
  }
}

export default StockRetrievalService;
