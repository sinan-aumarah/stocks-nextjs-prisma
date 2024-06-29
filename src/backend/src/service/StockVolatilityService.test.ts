import { swsCompanyPriceClose } from "@prisma/client";
import { beforeEach, describe, expect, it } from "@jest/globals";

import StockVolatilityService from "@/src/backend/src/service/StockVolatilityCalculatorService";

describe("StockVolatilityService", () => {
  let service: StockVolatilityService;

  const mockPriceHistory = (price: number = 100): swsCompanyPriceClose => ({
    price: price,
    date_created: "2012-4-3",
    date: "2012-4-3",
    company_id: "cmp1",
  });

  beforeEach(() => {
    service = new StockVolatilityService();
  });

  describe("calculateVolatility", () => {
    /**
     * Reference https://zerodha.com/varsity/chapter/volatility-calculation-historical/
     */
    const volatilityInputAndExpectedValues = [
      {
        description: "should return zero annual and daily volatility when there is no price movement",
        inputPriceHistory: [mockPriceHistory(10), mockPriceHistory(10)],
        expectedDailyVolatility: 0,
        expectedAnnualVolatility: 0,
      },
      {
        description: "should calculate fraction of the price movement as volatility",
        inputPriceHistory: [
          mockPriceHistory(10.5),
          mockPriceHistory(20.3),
          mockPriceHistory(20.3),
          mockPriceHistory(15.5),
        ],
        expectedDailyVolatility: 0.4779,
        expectedAnnualVolatility: 7.5868,
      },
      {
        //TODO is this correct or shall we use population SD?
        description: "should calculate using sample standard deviation",
        inputPriceHistory: [
          mockPriceHistory(500),
          mockPriceHistory(550),
          mockPriceHistory(520),
          mockPriceHistory(530),
        ],
        expectedDailyVolatility: 0.08,
        expectedAnnualVolatility: 1.2,
      },
    ];

    it.each(volatilityInputAndExpectedValues)("$description", (scenario) => {
      const result = service.calculateVolatility(
        scenario.inputPriceHistory,
        scenario.inputPriceHistory.length,
      );

      expect(result.dailyVolatility).toBeCloseTo(scenario.expectedDailyVolatility, 2);
      expect(result.annualVolatility).toBeCloseTo(scenario.expectedAnnualVolatility, 2);
      expect(result.isSufficientDataPresent).toBe(true);
      expect(result.totalDaysCompared).toBe(scenario.inputPriceHistory.length);
    });

    it("should return isSufficientDataPresent as false when not enough data present", () => {
      const pricesHistory = [mockPriceHistory(), mockPriceHistory(2)];
      const numberOfDaysToCompareVolatilityFor = 90;
      const result = service.calculateVolatility(pricesHistory, numberOfDaysToCompareVolatilityFor);

      expect(result.isSufficientDataPresent).toBe(false);
      expect(result.totalDaysCompared).toBe(pricesHistory.length);
    });

    it("should return isSufficientDataPresent as true when all required days are present", () => {
      const priceHistory = [mockPriceHistory(), mockPriceHistory(90)];

      const result = service.calculateVolatility(priceHistory, 2);

      expect(result.isSufficientDataPresent).toBe(true);
      expect(result.totalDaysCompared).toBe(priceHistory.length);
    });

    it("should return totalDaysCompared based on the number of sample price history", () => {
      const priceHistory = Array(25).fill(mockPriceHistory());

      const result = service.calculateVolatility(priceHistory, 90);

      expect(result.totalDaysCompared).toBe(25);
    });

    it.todo("assert all days are unique and in consecutive order");
    it.todo("assert calculation based on a large comprehensive data set");
    it.todo("assert input constraints such as length and data integrity is valid for the calculation");
  });
});
