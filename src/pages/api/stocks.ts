import type { NextApiRequest, NextApiResponse } from "next";

import StockRetrievalService from "@/src/backend/service/StockRetrievalService";
import { parseToNumberIfAvailable } from "@/src/pages/api/util";
import { PaginatedStocksRequest, PaginatedStocksResponse } from "@/src/backend/types/types";
import { StocksAPIResponse } from "@/src/pages/api/types";

const stockRetrievalService = new StockRetrievalService();

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: Retrieve a list of stocks
 *     description: Retrieve a list of stocks. The API is paginated and the default limit is 100 stocks. Stocks returned are sorted by name in ascending order.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of stocks to return.
 *         default: 100
 *       - in: query
 *         name: offset
 *         default: 0
 *         schema:
 *           type: integer
 *         description: The number of stocks to skip before starting to collect the result set.
 *       - in: query
 *         name: volatility-period
 *         schema:
 *           type: integer
 *         default: 90
 *         description: The number days to calculate the stock volatility for.
 *       - in: query
 *         name: include-price-history
 *         default: false
 *         schema:
 *           type: boolean
 *         description: Whether to include the price history in the response.
 *       - in: query
 *         name: price-history-limit
 *         default: 252
 *         schema:
 *           type: integer
 *         description: The number of previous share prices to retrieve in days. The maximum is 252 days.
 *     responses:
 *       200:
 *         description: A list of stocks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     version:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalStockCount:
 *                       type: integer
 *                 stocks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       companyName:
 *                         type: string
 *                       symbol:
 *                         type: string
 *                       exchangeSymbol:
 *                         type: string
 *                       uniqueSymbol:
 *                         type: string
 *                       latestPrice:
 *                         type: number
 *                       sharePrices:
 *                         type: array
 *                         items:
 *                           type: object
 *                       stockVolatility:
 *                         type: object
 *                       snowflake:
 *                         type: object
 *                         properties:
 *                           overallScore:
 *                             type: number
 *                           description:
 *                             type: string
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const apiVersion = 1;
  const {
    "price-history-limit": reqPriceHistoryLimit,
    "include-price-history": reqIncludePriceHistory,
    "volatility-period": reqVolatilityPeriodInDays = "90", // Default to "30
    limit: reqLimit,
    offset: reqOffset,
  } = req.query;

  const limit = parseToNumberIfAvailable(reqLimit);
  const offset = parseToNumberIfAvailable(reqOffset);
  const priceHistoryLimit = parseToNumberIfAvailable(reqPriceHistoryLimit);
  const volatilityPeriodInDays = parseToNumberIfAvailable(reqVolatilityPeriodInDays);
  const includePriceHistory = reqIncludePriceHistory === "true";

  const request: PaginatedStocksRequest = {
    volatilityPeriodInDays,
    limit,
    offset,
    priceHistoryLimit,
  };

  const stocksResponse = await stockRetrievalService.getStocksPaginated(request);

  return res.json(mapToResponse(apiVersion, stocksResponse, includePriceHistory));
}

const mapToResponse = (
  apiVersion: number,
  result: PaginatedStocksResponse,
  includePriceHistory: boolean,
): StocksAPIResponse => ({
  meta: {
    version: apiVersion,
    offset: result.offset,
    limit: result.limit,
    totalStockCount: result.totalStockCount,
  },
  stocks: result.stocks.map((company) => {
    return {
      companyName: company.companyName,
      symbol: company.symbol,
      exchangeSymbol: company.exchangeSymbol,
      uniqueSymbol: company.uniqueSymbol,
      latestPrice: company.latestPrice,
      ...(includePriceHistory && { sharePrices: company.sharePrices }),
      stockVolatility: company.stockVolatility,
      snowflake: {
        overallScore: company.snowflake.overallScore,
        description: company.snowflake.description,
      },
    };
  }),
});
