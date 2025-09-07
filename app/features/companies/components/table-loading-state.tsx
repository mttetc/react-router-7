import { Box, For, ScrollArea, Table } from "@chakra-ui/react";
import { LoadingRow } from "./table-loading-row";

/**
 * Loading state component for table
 */
export function TableLoadingState() {
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
                {/* Placeholder headers for loading state */}
                <Table.ColumnHeader width="80px">Rank</Table.ColumnHeader>
                <Table.ColumnHeader width="300px">Company</Table.ColumnHeader>
                <Table.ColumnHeader width="250px">
                  Description
                </Table.ColumnHeader>
                <Table.ColumnHeader width="120px">Stage</Table.ColumnHeader>
                <Table.ColumnHeader width="100px">Focus</Table.ColumnHeader>
                <Table.ColumnHeader width="120px">Funding</Table.ColumnHeader>
                <Table.ColumnHeader width="150px">Type</Table.ColumnHeader>
                <Table.ColumnHeader width="120px">Added</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <For each={Array.from({ length: 10 }, (_, i) => i)}>
                {(index) => <LoadingRow key={index} />}
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
