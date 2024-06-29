import { swsCompanyPriceClose } from "@prisma/client";

import { prisma } from "@/prisma/prisma";
import StockVolatilityService from "@/src/backend/service/StockVolatilityCalculatorService";
import {
  PaginatedStocksRequest,
  PaginatedStocksResponse,
  StockVolatilityScore,
} from "@/src/backend/types/types";

class StockRetrievalService {
  // one year worth of share prices
  private readonly maxNumberOfPriceHistory = 252;
  private readonly defaultCompaniesPerRequestLimit = 100;

  private stockVolatilityService: StockVolatilityService;

  constructor() {
    this.stockVolatilityService = new StockVolatilityService();
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

    const actualLimit = limit || this.defaultCompaniesPerRequestLimit;
    const actualOffset = offset || 0;
    const [companiesWithLastPrice, totalStockCount] = await prisma.$transaction([
      prisma.swsCompany.findMany({
        include: {
          swsCompanyPriceClose: {
            take: this.maxNumberOfPriceHistory,
            orderBy: {
              // This is actually sorting strings not dates. Prisma does not support sqlite date type
              date_created: "desc",
            },
          },
          swsCompanyScore: true,
        },
        orderBy: {
          name: "asc",
        },
        skip: actualOffset,
        take: actualLimit,
      }),
      prisma.swsCompany.count(),
    ]);

    return {
      limit: actualLimit,
      offset: actualOffset,
      totalStockCount: totalStockCount,
      stocks: companiesWithLastPrice.map((dbCompany) => {
        const sharePricesSortedByLatestToOldest = dbCompany.swsCompanyPriceClose;

        return {
          companyName: dbCompany.name,
          symbol: dbCompany.ticker_symbol,
          exchangeSymbol: dbCompany.exchange_symbol,
          uniqueSymbol: dbCompany.unique_symbol,
          latestPrice: sharePricesSortedByLatestToOldest[0].price,
          sharePrices: dbCompany.swsCompanyPriceClose?.slice(0, maxPriceHistory).map((price) => ({
            dateTime: new Date(price.date_created),
            price: price.price,
          })),
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

  private getStockVolatility(
    sharePricesSortedByDateDescending: swsCompanyPriceClose[],
    volatilityPeriodInDays: number | null,
  ): StockVolatilityScore {
    const sharePricesSortedByDateAsc = sharePricesSortedByDateDescending.slice().reverse();

    return this.stockVolatilityService.calculateVolatility(
      sharePricesSortedByDateAsc,
      volatilityPeriodInDays || 0,
    );
  }
}

export default StockRetrievalService;