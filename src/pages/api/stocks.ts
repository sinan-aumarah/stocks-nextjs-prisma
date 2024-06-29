import type { NextApiRequest, NextApiResponse } from "next";

import StockRetrievalService, {
  PaginatedStocksRequest,
} from "@/src/backend/src/service/StockRetrievalService";
import { parseToNumberIfAvailable } from "@/src/pages/api/util";

const stockRetrievalService = new StockRetrievalService();

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: Retrieve a list of stocks
 *     description: Retrieve a list of stocks. The stocks can be paginated, and the response includes the total count of stocks.
 *     parameters:
 *       - in: query
 *         name: price-history-limit
 *         schema:
 *           type: integer
 *         description: The number of previous share prices to retrieve.
 *       - in: query
 *         name: include-price-history
 *         schema:
 *           type: boolean
 *         description: Whether to include the price history in the response.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of stocks to return.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: The number of stocks to skip before starting to collect the result set.
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
 *                           type: number
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
  const includePriceHistory = reqIncludePriceHistory === "true";

  const request: PaginatedStocksRequest = {
    calculateVolatilityBasedOnLastNumberOfDays: numberOfPreviousSharePrices,
    ...(parsedLimit && { limit: parsedLimit }),
    ...(parsedOffset && { offset: parsedOffset }),
    ...(priceHistoryLimit && { priceHistoryLimit: priceHistoryLimit }),
  };

  const result = await stockRetrievalService.getStocksPaginated(request);

  return res.json({
    meta: {
      version: 1,
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
}
