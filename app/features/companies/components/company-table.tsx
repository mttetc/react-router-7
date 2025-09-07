import { For, ScrollArea, Table } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryState } from "nuqs";
import { filtersSearchParams } from "@/lib/search-params";
import type { Company } from "@/features/companies/types/schemas";
import { TABLE_COLUMNS } from "../utils/table-utils";
import { SortableHeader } from "./sortable-header";
import { AnimatedTableRow } from "./animated-table-row";
import { TableEmptyState } from "./table-empty-state";
import { TableLoadingState } from "./table-loading-state";

/**
 * Props for the CompanyTable component
 * @interface CompanyTableProps
 */
interface CompanyTableProps {
  /** Array of company data to display */
  companies: Company[];
  /** Whether the table is in a loading state */
  isLoading: boolean;
  /** Current page number for pagination context */
  currentPage: number;
}

/**
 * CompanyTable component for displaying companies data in a sortable table
 * @description A responsive table component with sorting, loading states, and empty states
 * @param props - Component props
 * @returns JSX element
 * @example
 * ```tsx
 * <CompanyTable
 *   companies={companiesData}
 *   isLoading={false}
 *   currentPage={1}
 * />
 * ```
 */
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
    return (
      <TableLoadingState
        currentPage={currentPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    );
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
            <AnimatePresence>
              <For each={companies}>
                {(company, index) => (
                  <AnimatedTableRow
                    key={company.id}
                    company={company}
                    position={index + 1}
                    currentPage={currentPage}
                  />
                )}
              </For>
            </AnimatePresence>
          </Table.Body>
        </Table.Root>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};
