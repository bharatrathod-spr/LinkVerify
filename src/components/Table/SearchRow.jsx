import React from "react";
import { Box, TextField, MenuItem, Grid, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchRow = ({
  headerData,
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
    <Box
      sx={{
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Grid container spacing={2} alignItems="center">

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          />
        </Grid>

        {dropdownSearchFields.map((field, i) => {
          const header = headerData.find((h) => h.field === field);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <TextField
                select
                label={header ? `Select ${header.label}` : `Select ${field.charAt(0).toUpperCase() + field.slice(1)}`}
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
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
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
          );
        })}

        {dateFilterField && (
          <>
            <Grid item xs={12} sm={6} md={3} lg={2}>
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
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
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
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                }}
              />
            </Grid>
          </>
        )}

        {handleDateChange && (
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              type="date"
              value={todayDate}
              onChange={handleDateChange}
              size="small"
              fullWidth
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchRow;
