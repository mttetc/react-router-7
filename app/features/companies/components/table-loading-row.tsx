import { For, Skeleton, Table } from "@chakra-ui/react";
import { TABLE_COLUMNS, SKELETON_MAP } from "../utils/table-utils";

interface LoadingRowProps {
  position?: number;
  currentPage?: number;
  bg?: string;
  borderColor?: string;
}

/**
 * Loading skeleton row for table
 */
export function LoadingRow({ 
  position = 1, 
  currentPage = 1, 
  bg = "white", 
  borderColor = "transparent" 
}: LoadingRowProps) {
  return (
    <Table.Row 
      bg={bg}
      borderLeft={position <= 3 && currentPage === 1 ? "3px solid" : undefined}
      borderLeftColor={position <= 3 && currentPage === 1 ? borderColor : undefined}
    >
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
