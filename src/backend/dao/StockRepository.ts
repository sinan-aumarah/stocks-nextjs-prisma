"use server";
import { prisma } from "@/prisma/prisma";

class StockRepository {
  async doGet(limit: number, offset: number, priceHistoryLimit: number) {
    const [companiesWithPriceHistory, totalStockCount] = await prisma.$transaction([
      prisma.swsCompany.findMany({
        include: {
          swsCompanyPriceClose: {
            orderBy: {
              // This is actually sorting strings not dates. Prisma does not support sqlite date type
              date_created: "desc",
            },
            take: priceHistoryLimit,
          },
          swsCompanyScore: true,
        },
        orderBy: {
          name: "asc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.swsCompany.count(),
    ]);

    return {
      companiesWithPriceHistory,
      totalStockCount,
    };
  }
}

export default StockRepository;
