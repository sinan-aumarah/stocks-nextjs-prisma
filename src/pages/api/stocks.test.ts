import { NextApiRequest, NextApiResponse } from "next";

import StockRetrievalService from "@/src/backend/service/StockRetrievalService";
import handle from "@/src/pages/api/stocks";
import { getMockedStockServiceResponse } from "@/src/backend/dao/mock-objects";

jest.mock("@/src/backend/service/StockRetrievalService");

describe("stocks API", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      json: jest.fn(),
    };
  });

  it("should successfully retrieve stocks", async () => {
    const mockStocks = [getMockedStockServiceResponse()];

    (StockRetrievalService.prototype.getStocksPaginated as jest.Mock).mockResolvedValue({
      offset: 0,
      limit: 1,
      totalStockCount: 1,
      stocks: mockStocks,
    });

    await handle(req as NextApiRequest, res as NextApiResponse);
    // TODO. Do proper checks here
    expect(res.json).toHaveBeenCalledWith({
      meta: {
        version: 1,
        offset: 0,
        limit: 1,
        totalStockCount: 1,
      },
      stocks: expect.any(Array),
    });
  });

  it.todo("should handle error when retrieving stocks");
  it.todo("should validate request query parameters");
});
