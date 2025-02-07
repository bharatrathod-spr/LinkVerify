import React, { useState } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import NoDataImage from "../../assets/svg/NoData.png"; 

const TableRowComponent = ({
  filteredData,
  headerData,
  isMobile,
  collapseFields,
}) => {
  const [openRow, setOpenRow] = useState({});

  const handleToggle = (rowIndex) => {
    setOpenRow((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  return (
    <TableBody>
      {filteredData?.length > 0 ? (
        filteredData.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <TableRow
              hover={isMobile}
              onClick={() => {
                if (isMobile) {
                  handleToggle(rowIndex);
                }
              }}
              sx={{ cursor: isMobile && "pointer" }}
            >
              {headerData?.map((header, index) => {
                const cellContent = row[header.field] || "-";

                return (
                  <TableCell
                    key={index}
                    sx={{
                      whiteSpace: "break-spaces",
                      wordBreak: "break-word",
                      ...(header.isOverflow && {
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }),
                    }}
                  >
                    {header.isOverflow ? (
                      <Tooltip title={cellContent !== "-" && cellContent} arrow>
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            cursor: cellContent !== "-" && "pointer",
                          }}
                        >
                          {cellContent}
                        </span>
                      </Tooltip>
                    ) : (
                      cellContent
                    )}
                  </TableCell>
                );
              })}
            </TableRow>

            {isMobile && openRow[rowIndex] && (
              <TableRow>
                <TableCell colSpan={headerData?.length}>
                  <Box sx={{ padding: 2 }}>
                    {collapseFields?.map((field, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        component="div"
                        sx={{
                          marginBottom: 1,
                          whiteSpace: "break-spaces",
                          wordBreak: "break-word",
                        }}
                      >
                        <strong>{field}:</strong> {row[field] || "-"}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={headerData?.length} sx={{ textAlign: "center" }}>
            <img
              src={NoDataImage}
              alt="No Data"
              style={{ width: "200px", height: "250px" }}
            />
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default TableRowComponent;
