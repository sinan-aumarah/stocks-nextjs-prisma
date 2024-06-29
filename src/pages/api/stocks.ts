import type { NextApiRequest, NextApiResponse } from "next";

import StockRetrievalService from "@/src/backend/src/service/StockRetrievalService";

// "snowflake": {
//     "description": "A proven past performer which is rather undervalued",
//         "scores": {
//         "value": 2.51,
//             "future": 2.44,
//             "past": 5.18,
//             "health": 5.05,
//             "dividend": 1.53
//     }
// },
//

// const companiesWithLastPrice: CompanyPrice[] = await prisma.$queryRaw<$swsCompanyPayload &
// $swsCompanyPriceClosePayload>`
//     SELECT *
//     FROM swsCompany
//              INNER JOIN swsCompanyPriceClose
//                         ON swsCompany.id = swsCompanyPriceClose.company_id
//     ORDER BY swsCompanyPriceClose.date_created DESC
//     TAKE ${maxNumberOfPreviousSharePrices}
// `;
//
// const result = companiesWithLastPrice.map((company: CompanyPrice) => ({
//     companyName: company.name,
//     uniqueSymbol: company.unique_symbol,
//     sharePrices: {
//         dateTime: company.date_created,
//         price: company.price,
//     },
// }));
const stockRetrievalService = new StockRetrievalService();

// GET /api/stocks
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const maxNumberOfPreviousSharePrices = 100;
  var numberOfPreviousSharePrices = 1;
  const { price_limit } = req.query;

  if (price_limit) {
    numberOfPreviousSharePrices = Math.min(parseInt(price_limit as string), maxNumberOfPreviousSharePrices);
  }

  const result = await stockRetrievalService.getLatestStocks(numberOfPreviousSharePrices);

  return res.json(result);
}
