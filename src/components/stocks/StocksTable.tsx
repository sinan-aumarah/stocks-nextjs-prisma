import React from "react";
import {
  DropdownItem,
  DropdownMenu,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { Dropdown, DropdownTrigger } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { ChevronDownIcon } from "@nextui-org/shared-icons";

import { cellRenderer } from "@/src/components/stocks/CellFormat";
import { StocksAPIResponse } from "@/src/pages/api/types";
import { Stock } from "@/src/backend/types/types";

export default function StocksTable() {
  const STOCKS_API_URL = "/api/stocks?limit=25";
  const [isLoading, setIsLoading] = React.useState(true);
  const [exchangeFilter, setExchangeFilter] = React.useState<string>("all");

  const renderCell = React.useCallback((stock: any, columnKey: keyof Stock) => {
    const cellValue = stock[columnKey];

    return cellRenderer(columnKey, cellValue);
  }, []);

  let stocksList = useAsyncList({
    async load({ signal }) {
      let res = await fetch(STOCKS_API_URL, {
        signal,
      });
      let stocksJsonResponse: StocksAPIResponse = await res.json();

      setIsLoading(false);

      return {
        items: stocksJsonResponse.stocks.map((stock: any) => ({
          companyName: stock.companyName,
          exchangeSymbol: stock.exchangeSymbol,
          uniqueSymbol: stock.uniqueSymbol,
          overallScore: stock.snowflake.overallScore,
          description: stock.snowflake.description,
          latestPrice: stock.latestPrice,
          volatility: {
            ...stock.stockVolatility,
            sortKey: stock.stockVolatility.annualVolatility,
          },
        })),
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: any, b: any) => {
          let first = a[sortDescriptor.column as keyof Stock];
          let second = b[sortDescriptor.column as keyof Stock];

          if (typeof first === "object" && !Array.isArray(first) && first !== null) {
            first = a[sortDescriptor.column as keyof Stock].sortKey;
            second = b[sortDescriptor.column as keyof Stock].sortKey;
          }

          let comparator = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            comparator *= -1;
          }

          return comparator;
        }),
      };
    },
  });

  const filteredStocks = React.useMemo(() => {
    let filteredStocks = stocksList.items;

    if (exchangeFilter !== "all" && Array.from(exchangeFilter).length !== 3) {
      filteredStocks = filteredStocks.filter((stock) =>
        Array.from(exchangeFilter).includes(stock.exchangeSymbol),
      );
    }

    return filteredStocks;
  }, [stocksList, exchangeFilter]);

  const exchangeOptions = Array.from(
    new Set((stocksList.items as Stock[])?.map((stock: Stock) => stock.exchangeSymbol)),
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Filter by exchange
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={exchangeFilter}
                selectionMode="multiple"
                onSelectionChange={setExchangeFilter}
              >
                {exchangeOptions?.map((exchangeOption) => (
                  <DropdownItem key={exchangeOption} className="capitalize">
                    {exchangeOption}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <span className="text-default-400 text-small">Total {filteredStocks.length} stocks</span>
        </div>
      </div>
    );
  }, [exchangeFilter, filteredStocks]);

  return (
    <Table
      aria-label="Stocks table"
      classNames={{
        table: "min-h-[400px]",
      }}
      selectionMode="single"
      sortDescriptor={stocksList.sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={stocksList.sort}
    >
      <TableHeader>
        <TableColumn key="companyName" allowsSorting>
          Name
        </TableColumn>
        <TableColumn key="uniqueSymbol" allowsSorting>
          Symbol
        </TableColumn>
        <TableColumn key="overallScore" allowsSorting>
          Company score
        </TableColumn>
        <TableColumn key="latestPrice" allowsSorting>
          Latest price
        </TableColumn>
        <TableColumn key="volatility" allowsSorting>
          Volatility percentage
        </TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={filteredStocks as Stock[]}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(stock) => (
          <TableRow key={stock.uniqueSymbol}>
            {(columnKey) => <TableCell>{renderCell(stock, columnKey as keyof Stock)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
