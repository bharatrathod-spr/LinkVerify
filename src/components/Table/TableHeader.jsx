import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";

const TableHeader = ({
  headerData,
  sortingList,
  sortedColumn,
  sortDirection,
  handleSort,
}) => {
  return (
    <TableHead>
      <TableRow>
        {headerData.map((header, index) => (
          <TableCell
            key={index}
            style={{
              width: header?.width || "auto",
              textAlign: header?.align || "left",
            }}
          >
            {sortingList.includes(header.field) ? (
              <TableSortLabel
                active={sortedColumn === header.field}
                direction={
                  sortedColumn === header.field ? sortDirection : "asc"
                }
                onClick={() => handleSort(header.field)}
              >
                {header.label}
              </TableSortLabel>
            ) : (
              header.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
