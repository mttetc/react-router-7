import { For, Skeleton, Table } from "@chakra-ui/react";
import { TABLE_COLUMNS, SKELETON_MAP } from "../utils/table-utils";

/**
 * Loading skeleton row for table
 */
export function LoadingRow() {
  return (
    <Table.Row>
      <For each={TABLE_COLUMNS}>
        {(column) => (
          <Table.Cell key={column.key} width={column.width}>
            {SKELETON_MAP[column.key] || (
              <Skeleton height="16px" width="60px" />
            )}
          </Table.Cell>
        )}
      </For>
    </Table.Row>
  );
}
