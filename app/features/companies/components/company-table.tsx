import { For, ScrollArea, Table } from "@chakra-ui/react";
import { useQueryState } from "nuqs";
import { filtersSearchParams } from "@/lib/search-params";
import type { Company } from "@/types/companies";
import { TABLE_COLUMNS } from "../utils/table-utils";
import { SortableHeader } from "./sortable-header";
import { CompanyRow } from "./table-company-row";
import { TableEmptyState } from "./table-empty-state";
import { TableLoadingState } from "./table-loading-state";

interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  currentPage: number;
}

export const CompanyTable = ({
  companies,
  isLoading,
  currentPage,
}: CompanyTableProps) => {
  // Use nuqs directly for sorting
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    filtersSearchParams.sortBy
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    filtersSearchParams.sortOrder
  );

  const handleSort = (newSortBy: string) => {
    const newOrder =
      sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
  };

  const renderTableHeader = () => (
    <Table.Header bg="brand.50">
      <Table.Row>
        <For each={TABLE_COLUMNS}>
          {(column) => {
            if (column.sortable) {
              return (
                <SortableHeader
                  key={column.key}
                  sortKey={column.sortKey!}
                  currentSort={sortBy}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                  textColor="brand.700"
                >
                  {column.label}
                </SortableHeader>
              );
            }
            return (
              <Table.ColumnHeader
                key={column.key}
                width={column.width}
                color="brand.700"
              >
                {column.label}
              </Table.ColumnHeader>
            );
          }}
        </For>
      </Table.Row>
    </Table.Header>
  );

  if (isLoading) {
    return <TableLoadingState currentPage={currentPage} />;
  }

  if (companies.length === 0) {
    return <TableEmptyState />;
  }

  return (
    <ScrollArea.Root
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      maxWidth="100%"
      role="region"
      aria-label="Companies table"
    >
      <ScrollArea.Viewport>
        <Table.Root
          variant="outline"
          size="sm"
          minWidth="1100px"
          role="table"
          aria-label="Companies directory"
        >
          {renderTableHeader()}
          <Table.Body>
            <For each={companies}>
              {(company, index) => (
                <CompanyRow
                  key={company.id}
                  company={company}
                  position={index + 1}
                  currentPage={currentPage}
                />
              )}
            </For>
          </Table.Body>
        </Table.Root>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};
