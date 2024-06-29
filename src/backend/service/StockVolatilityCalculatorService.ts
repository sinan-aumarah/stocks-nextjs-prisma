import { swsCompanyPriceClose } from "@prisma/client";

import { StockVolatilityScore } from "@/src/backend/types/types";

/**
 * Calculate the annual and daily volatility of a stock using the standard deviation sample method.
 * Reference https://www.macroption.com/historical-volatility-excel/
 *
 * @param priceHistorySorted an array of sorted closed price history elements sorted by date in ascending
 * @param numberOfDaysToCompare the number of days to consider when calculating the volatility
 * to ensure daily returns are calculated correctly. Defaults to 252 days (working days in a year) and will
 * never calculate more than this number regardless of the input. // TODO: is this really necessary or useful?
 */
class StockVolatilityService {
  private readonly WORKING_DAYS_PER_ANNUM = 252;

  public calculateVolatility(
    priceHistorySortedByOldestToLatest: swsCompanyPriceClose[],
    numberOfDaysToCompare: number = this.WORKING_DAYS_PER_ANNUM,
  ): StockVolatilityScore {
    // TODO: This is a naive approach, we should be ensuring the days are unique and in consecutive order
    const isEnoughCorrectDataAvailable = priceHistorySortedByOldestToLatest.length >= numberOfDaysToCompare;

    const totalDaysToCompareFrom = Math.min(priceHistorySortedByOldestToLatest.length, numberOfDaysToCompare);
    const lastNPrices: number[] = this.getLastNElements(
      priceHistorySortedByOldestToLatest,
      totalDaysToCompareFrom,
    ).map(({ price }) => price);
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
    return prices.slice(1).map((price, i) => Math.log(price / prices[i]));
  }

  private getLastNElements<T>(array: T[], n: number): T[] {
    return array.slice(Math.max(array.length - n, 0));
  }
}

export default StockVolatilityService;
