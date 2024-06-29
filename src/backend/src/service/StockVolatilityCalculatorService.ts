import { swsCompanyPriceClose } from "@prisma/client";

type StockVolatilityScore = {
  annualVolatility: number;
  dailyVolatility: number;
  isSufficientDataPresent: boolean;
  totalDaysCompared: number;
};

/**
 * Calculate the annual and daily volatility of a stock using the standard deviation method.
 * Reference https://www.macroption.com/historical-volatility-excel/
 *
 * @param priceHistorySorted an array of sorted closed price history elements sorted by date in ascending
 * @param numberOfDaysToCompare the number of days to consider when calculating the volatility
 * to ensure daily returns are calculated correctly
 */
class StockVolatilityService {
  private readonly WORKING_DAYS_PER_ANNUM = 252;

  public calculateVolatility(
    priceHistory: swsCompanyPriceClose[],
    numberOfDaysToCompare: number = 90,
  ): StockVolatilityScore {
    // TODO: This is a naive approach, we should be ensuring the days and are unique and in consecutive order
    const isEnoughCorrectDataAvailable = priceHistory.length >= numberOfDaysToCompare;

    const totalDaysToCompareFrom = Math.min(priceHistory.length, numberOfDaysToCompare);
    const lastNPrices: number[] = this.getLastNElements(priceHistory, totalDaysToCompareFrom).map(
      ({ price }) => price,
    );
    const volatilityScore = this.calculateVolatilityUsingStandardDeviation(lastNPrices);

    return {
      isSufficientDataPresent: isEnoughCorrectDataAvailable,
      totalDaysCompared: totalDaysToCompareFrom,
      ...volatilityScore,
    };
  }

  private calculateVolatilityUsingStandardDeviation(priceHistorySorted: number[]) {
    const dailyReturns = this.calculateDailyReturns(priceHistorySorted);
    const dailyStdDev = this.standardDeviationSample(dailyReturns);

    // Annualized standard deviation by multiplying by square root of number of trading days in a year
    const annualizedStdDev = dailyStdDev * Math.sqrt(this.WORKING_DAYS_PER_ANNUM);

    return {
      dailyVolatility: dailyStdDev,
      annualVolatility: annualizedStdDev,
    };
  }

  private standardDeviationSample(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length - 1) || 0;

    return Math.sqrt(variance);
  }

  private calculateDailyReturns(prices: number[]): number[] {
    const dailyReturns: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      const dailyReturn = Math.log(prices[i] / prices[i - 1]);

      dailyReturns.push(dailyReturn);
    }

    return dailyReturns;
  }

  private getLastNElements<T>(array: T[], n: number): T[] {
    return array.slice(Math.max(array.length - n, 0));
  }
}

export default StockVolatilityService;
