import { Box, Flex, Table } from "@chakra-ui/react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useRef } from "react";
import { Tooltip } from "@/components/ui/tooltip";

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort: string;
  currentOrder: string;
  onSort: (sortBy: string) => void;
  textColor?: string;
}

/**
 * Sortable table header component with accessibility features
 */
export function SortableHeader({
  children,
  sortKey,
  currentSort,
  currentOrder,
  onSort,
  textColor,
}: SortableHeaderProps) {
  const isActive = currentSort === sortKey;
  const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc";
  const tooltipText = `Click to sort by ${children} ${
    nextOrder === "asc" ? "ascending" : "descending"
  }`;

  const ref = useRef<HTMLTableCellElement>(null);

  const handleClick = () => {
    onSort(sortKey);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSort(sortKey);
    }
  };

  return (
    <Tooltip content={tooltipText} positioning={{ placement: "top" }}>
      <Table.ColumnHeader
        ref={ref}
        color={textColor}
        cursor="pointer"
        _hover={{ bg: "brand.100" }}
        role="button"
        tabIndex={0}
        aria-label={`Sort by ${children} ${
          isActive
            ? `(${currentOrder === "asc" ? "ascending" : "descending"})`
            : ""
        }`}
        aria-sort={
          isActive
            ? currentOrder === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <Flex align="center" justify="space-between" w="full">
          {children}
          {isActive && (
            <Box ml={2} aria-hidden="true">
              {currentOrder === "asc" ? (
                <FaCaretUp size={12} />
              ) : (
                <FaCaretDown size={12} />
              )}
            </Box>
          )}
        </Flex>
      </Table.ColumnHeader>
    </Tooltip>
  );
}
