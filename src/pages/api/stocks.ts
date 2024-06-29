import type { NextApiRequest, NextApiResponse } from "next";

import StockRetrievalService from "@/src/backend/src/service/StockRetrievalService";

const stockRetrievalService = new StockRetrievalService();

// GET /api/stocks
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const maxNumberOfPreviousSharePrices = 100;
  let numberOfPreviousSharePrices = 1;
  const { price_limit } = req.query;

  if (price_limit) {
    numberOfPreviousSharePrices = Math.min(parseInt(price_limit as string), maxNumberOfPreviousSharePrices);
  }

  const result = await stockRetrievalService.getLatestStocks(numberOfPreviousSharePrices);

  return res.json(result);
}
