import { motion } from "framer-motion";
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
} from "../utils/company-utils";

// Import the items per page constant
const ITEMS_PER_PAGE = 12;

// Convert Chakra UI color tokens to CSS values for inline styles
function getCSSColor(chakraColor: string): string {
  switch (chakraColor) {
    case "yellow.100":
      return "#fef3c7";
    case "yellow.300":
      return "#fcd34d";
    case "gray.100":
      return "#f3f4f6";
    case "gray.300":
      return "#d1d5db";
    case "orange.100":
      return "#fed7aa";
    case "orange.300":
      return "#fdba74";
    case "white":
      return "#ffffff";
    case "transparent":
      return "transparent";
    default:
      return chakraColor;
  }
}

interface AnimatedTableRowProps {
  company: Company;
  position: number;
  currentPage: number;
}

/**
 * Animated table row component with smooth transitions
 * Combines the original CompanyRow logic with Framer Motion animations
 */
export function AnimatedTableRow({
  company,
  position,
  currentPage,
}: AnimatedTableRowProps) {
  const helpers: CellHelpers = createCellHelpers(position, currentPage);

  return (
    <motion.tr
      key={company.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      style={{
        display: "table-row",
        backgroundColor: getCSSColor(
          getPositionBackground(position, currentPage)
        ),
        borderBottom:
          position < ITEMS_PER_PAGE ? "1px solid #e2e8f0" : undefined,
      }}
    >
      <For each={TABLE_COLUMNS}>
        {(column, index) => (
          <Table.Cell
            key={column.key}
            width={column.width}
            style={
              index === 0 && position <= 3 && currentPage === 1
                ? {
                    borderLeft: "3px solid",
                    borderLeftColor: getCSSColor(
                      getTableRowBorderColor(position, currentPage)
                    ),
                  }
                : undefined
            }
          >
            {column.render(company, helpers)}
          </Table.Cell>
        )}
      </For>
    </motion.tr>
  );
}
