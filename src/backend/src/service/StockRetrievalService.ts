import { prisma } from "@/config/prisma";
import StockVolatilityService from "@/src/backend/src/service/StockVolatilityCalculatorService";

class StockRetrievalService {
  private static readonly MAX_NUMBER_OF_SHARE_PRICES = 90;
  private stockVolatilityService: StockVolatilityService;

  constructor() {
    this.stockVolatilityService = new StockVolatilityService();
  }

  async getLatestStocks(defaultNumberOfPreviousSharePrices: number) {
    const companiesWithLastPrice = await prisma.swsCompany.findMany({
      include: {
        swsCompanyPriceClose: {
          take: StockRetrievalService.MAX_NUMBER_OF_SHARE_PRICES,
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
    });

    return companiesWithLastPrice.map((company) => {
      return {
        companyName: company.name,
        symbol: company.ticker_symbol,
        exchangeSymbol: company.exchange_symbol,
        uniqueSymbol: company.unique_symbol,
        latestPrice: company.swsCompanyPriceClose[0].price,
        sharePrices: company.swsCompanyPriceClose
          ?.slice(0, defaultNumberOfPreviousSharePrices)
          .map((price) => ({
            dateTime: new Date(price.date_created),
            price: price.price,
          })),
        stockVolatility: this.stockVolatilityService.calculateVolatility(company.swsCompanyPriceClose),
        snowflake: {
          overallScore: company.swsCompanyScore.total,
          description: company.swsCompanyScore.sentence,
          value: company.swsCompanyScore.value,
          future: company.swsCompanyScore.future,
          past: company.swsCompanyScore.past,
          health: company.swsCompanyScore.health,
          dividend: company.swsCompanyScore.dividend,
        },
      };
    });
  }
}

export default StockRetrievalService;
