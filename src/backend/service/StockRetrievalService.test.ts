import StockRetrievalService from "@/src/backend/service/StockRetrievalService";
import StockRepository from "@/src/backend/dao/StockRepository";
import StockVolatilityService from "@/src/backend/service/StockVolatilityService";
import { getMockStockRepositoryResponse } from "@/src/backend/dao/mock-objects";

jest.mock("@/src/backend/dao/StockRepository");
jest.mock("@/src/backend/service/StockVolatilityService");

describe("StockRetrievalService", () => {
  let service: StockRetrievalService;
  let mockStockRepository: jest.Mocked<StockRepository>;
  let mockStockVolatilityService: jest.Mocked<StockVolatilityService>;

  beforeEach(() => {
    mockStockRepository = new StockRepository() as jest.Mocked<StockRepository>;
    mockStockVolatilityService = new StockVolatilityService() as jest.Mocked<StockVolatilityService>;
    service = new StockRetrievalService(mockStockRepository, mockStockVolatilityService);

    const mockStockRepositoryResponse = getMockStockRepositoryResponse() as any;

    mockStockRepository.doGet.mockResolvedValue(mockStockRepositoryResponse);
  });

  describe("getStocksPaginated", () => {
    it("should get stock volatility based on requested period", async () => {
      const request = {
        volatilityPeriodInDays: 90,
      };

      await service.getStocksPaginated(request);

      expect(mockStockVolatilityService.calculateVolatility).toHaveBeenCalledWith(
        expect.any(Array),
        request.volatilityPeriodInDays,
      );
    });
    describe("when valid request values are given", () => {
      it("should use request values if they are below max limits", async () => {
        const request = {
          limit: 55,
          offset: 22,
          priceHistoryLimit: 252,
        };

        await service.getStocksPaginated(request);

        expect(mockStockRepository.doGet).toHaveBeenCalledWith(
          request.limit,
          request.offset,
          request.priceHistoryLimit,
        );
      });

      it("should use max default values if input values are beyond the threshold", async () => {
        const expectedMaxLimit = 1000;
        const expectedMaxPriceHistory = 252;
        const request = {
          limit: 999999,
          offset: 900,
          priceHistoryLimit: 800,
        };

        await service.getStocksPaginated(request);

        expect(mockStockRepository.doGet).toHaveBeenCalledWith(
          expectedMaxLimit,
          request.offset,
          expectedMaxPriceHistory,
        );
      });
    });
    describe("when no request values given, use default values", () => {
      it("should get 252 days of price history", async () => {
        const expectedDefaultPriceHistory = 252;

        await service.getStocksPaginated({});

        expect(mockStockRepository.doGet).toHaveBeenCalledWith(
          expect.any(Number),
          expect.any(Number),
          expectedDefaultPriceHistory,
        );
      });

      it("should use 0 for offset", async () => {
        await service.getStocksPaginated({});

        expect(mockStockRepository.doGet).toHaveBeenCalledWith(expect.any(Number), 0, expect.any(Number));
      });

      it("should use 100 for limit", async () => {
        await service.getStocksPaginated({});

        expect(mockStockRepository.doGet).toHaveBeenCalledWith(100, expect.any(Number), expect.any(Number));
      });
    });
    it.todo("assert response is mapped correctly");
    it.todo("assert latest price is retrieved correctly");
    it.todo("assert share prices are retrieved correctly");
  });
});
