import React from "react";
import { Box, TextField, MenuItem, Grid } from "@mui/material";

const SearchRow = ({
  dropdownSearchFields,
  dropdownSearch,
  setDropdownSearch,
  dateFilterField,
  dateRange,
  setDateRange,
  searchTerm,
  setSearchTerm,
  allData,
  handleDateChange,
  todayDate,
}) => {
  const getDropdownOptions = (field) => {
    const options = Array.from(new Set(allData.map((row) => row[field])));
    return options;
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Grid container spacing={2}>
        {/* Search Field */}
        <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
          <TextField
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            variant="outlined"
            size="small"
            fullWidth
          />
        </Grid>

        {/* Dropdowns */}
        {dropdownSearchFields.map((field, i) => (
          <Grid item xs={12} sm={6} md={3} lg={2} xl={2} key={i}>
            <TextField
              select
              label={`Select ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              value={dropdownSearch[field] || ""}
              onChange={(e) =>
                setDropdownSearch((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              size="small"
              fullWidth
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      overflowY: "auto",
                    },
                  },
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {getDropdownOptions(field).map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}

        {dateFilterField && (
          <>
            <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
              <TextField
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
              <TextField
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
                size="small"
                fullWidth
              />
            </Grid>
          </>
        )}

        {handleDateChange && (
          <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
            <TextField
              type="date"
              value={todayDate}
              onChange={handleDateChange}
              size="small"
              fullWidth
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchRow;
