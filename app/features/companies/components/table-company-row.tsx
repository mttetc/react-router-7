import { For, Table } from "@chakra-ui/react";
import type { Company } from "@/features/companies/types/schemas";
import {
  TABLE_COLUMNS,
  createCellHelpers,
  type CellHelpers,
} from "../utils/table-utils";
import {
  getPositionBackground,
  getTableRowBorderColor,
  isTopThreePosition,
} from "../utils/company-utils";

interface CompanyRowProps {
  company: Company;
  position: number;
  currentPage: number;
}

/**
 * Table row component for displaying company data
 */
export function CompanyRow({
  company,
  position,
  currentPage,
}: CompanyRowProps) {
  const helpers: CellHelpers = createCellHelpers(position, currentPage);
  const isTopThree = isTopThreePosition(position, currentPage);

  return (
    <Table.Row
      bg={isTopThree ? getPositionBackground(position, currentPage) : "white"}
      borderLeft={position <= 3 && currentPage === 1 ? "3px solid" : undefined}
      borderLeftColor={
        position <= 3 && currentPage === 1
          ? getTableRowBorderColor(position, currentPage)
          : undefined
      }
      _hover={{
        bg: isTopThree
          ? getPositionBackground(position, currentPage)
          : "gray.50",
        opacity: 0.95,
      }}
    >
      <For each={TABLE_COLUMNS}>
        {(column) => (
          <Table.Cell key={column.key} width={column.width}>
            {column.render(company, helpers)}
          </Table.Cell>
        )}
      </For>
    </Table.Row>
  );
}
