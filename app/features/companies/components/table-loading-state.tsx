import { Box, For, ScrollArea, Table } from "@chakra-ui/react";
import { LoadingRow } from "./table-loading-row";
import { SortableHeader } from "./sortable-header";
import { TABLE_COLUMNS } from "../utils/table-utils";
import {
  getPositionBackground,
  getPositionBorderColor,
} from "../utils/company-utils";

interface TableLoadingStateProps {
  currentPage?: number;
  sortBy?: string;
  sortOrder?: string;
  onSort?: (sortBy: string) => void;
}

/**
 * Loading state component for table
 */
export function TableLoadingState({
  currentPage = 1,
  sortBy,
  sortOrder,
  onSort,
}: TableLoadingStateProps) {
  return (
    <Box
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      maxWidth="100%"
    >
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <Table.Root variant="outline" size="sm" minWidth="1100px">
            <Table.Header bg="brand.50">
              <Table.Row>
                <For each={TABLE_COLUMNS}>
                  {(column) => {
                    if (column.sortable) {
                      return (
                        <SortableHeader
                          key={column.key}
                          sortKey={column.sortKey!}
                          currentSort={sortBy || ""}
                          currentOrder={sortOrder || "asc"}
                          onSort={onSort || (() => {})}
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
            <Table.Body>
              <For each={Array.from({ length: 10 }, (_, i) => i)}>
                {(index) => {
                  const position = index + 1;
                  const rowBg = getPositionBackground(position, currentPage);
                  const rowBorderColor = getPositionBorderColor(
                    position,
                    currentPage
                  );

                  return (
                    <LoadingRow
                      key={index}
                      position={position}
                      currentPage={currentPage}
                      bg={rowBg}
                      borderColor={rowBorderColor}
                    />
                  );
                }}
              </For>
            </Table.Body>
          </Table.Root>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Box>
  );
}
