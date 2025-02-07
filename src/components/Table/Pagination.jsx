import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="body2">
          {totalItems > 0
            ? `${startItem}–${endItem} of ${totalItems}`
            : "No items available"}
        </Typography>

        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          <ArrowForward />
        </IconButton>
      </Box>

      <TextField
        select
        value={pageSize}
        onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
        size="small"
      >
        {[10, 25, 50, 100].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default Pagination;
