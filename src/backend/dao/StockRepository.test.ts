import StockRepository from "@/src/backend/dao/StockRepository";
import { prismaMock } from "@/prisma/prisma.jest.mock";
import { getMockCompany } from "@/src/backend/dao/mock-objects";

describe("StockRepository", () => {
  const stockDao: StockRepository = new StockRepository();

  describe("doGet", () => {
    it("should include historical share prices limited to priceHistoryLimit and ordered desc", async () => {
      const mockCompanies = [getMockCompany(), getMockCompany()];
      const mockCount = 100;
      const expectedPriceHistoryLimit = 10;

      prismaMock.$transaction.mockResolvedValue([mockCompanies, mockCount]);
      const { companiesWithLastPrice, totalStockCount } = await stockDao.doGet(
        10,
        0,
        expectedPriceHistoryLimit,
      );

      expect(prismaMock.swsCompany.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            swsCompanyPriceClose: {
              orderBy: {
                date_created: "desc",
              },
              take: expectedPriceHistoryLimit,
            },
            swsCompanyScore: true,
          },
        }),
      );
      expect(companiesWithLastPrice).toEqual(mockCompanies);
      expect(totalStockCount).toEqual(mockCount);
    });

    it("should use offset and limit arguments for query pagination", async () => {
      const expectedOffset = 5;
      const expectedLimit = 20;

      prismaMock.$transaction.mockResolvedValue([[], 10]);

      await stockDao.doGet(expectedLimit, expectedOffset, 10);

      expect(prismaMock.swsCompany.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: expectedOffset,
          take: expectedLimit,
        }),
      );
    });

    it("should order companies by name ascending", async () => {
      prismaMock.$transaction.mockResolvedValue([[], 10]);

      await stockDao.doGet(1, 1, 10);

      expect(prismaMock.swsCompany.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            name: "asc",
          },
        }),
      );
    });
  });
});
