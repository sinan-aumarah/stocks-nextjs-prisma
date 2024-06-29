import type { NextApiRequest, NextApiResponse } from "next";

import StockRetrievalService, {
  PaginatedStocksRequest,
} from "@/src/backend/src/service/StockRetrievalService";
import { parseToNumberIfAvailable } from "@/src/pages/api/util";

const stockRetrievalService = new StockRetrievalService();

// GET /api/stocks
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  let numberOfPreviousSharePrices = 1;
  const {
    "price-history-limit": reqPriceHistoryLimit,
    "include-price-history": reqIncludePriceHistory,
    limit,
    offset,
  } = req.query;

  const parsedLimit = parseToNumberIfAvailable(limit);
  const parsedOffset = parseToNumberIfAvailable(offset);
  const priceHistoryLimit = parseToNumberIfAvailable(reqPriceHistoryLimit);

  const request: PaginatedStocksRequest = {
    calculateVolatilityBasedOnLastNumberOfDays: numberOfPreviousSharePrices,
    ...(parsedLimit && { limit: parsedLimit }),
    ...(parsedOffset && { offset: parsedOffset }),
    ...(priceHistoryLimit && { priceHistoryLimit: priceHistoryLimit }),
  };

  const result = await stockRetrievalService.getStocksPaginated(request);

  return res.json(
    result.map((company) => {
      return {
        companyName: company.companyName,
        symbol: company.symbol,
        exchangeSymbol: company.exchangeSymbol,
        uniqueSymbol: company.uniqueSymbol,
        latestPrice: company.latestPrice,
        ...(reqIncludePriceHistory && { sharePrices: company.sharePrices }),
        stockVolatility: company.stockVolatility,
        snowflake: {
          overallScore: company.snowflake.overallScore,
          description: company.snowflake.description,
        },
        totalStockCount: company.totalStockCount,
      };
    }),
  );
}
