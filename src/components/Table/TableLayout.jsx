import React, { useState, useEffect } from "react";
import {
  Box,
  TableContainer,
  Table,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TableRowComponent from "./TableRowComponent";
import TableHeader from "./TableHeader";
import SearchRow from "./SearchRow";
import Pagination from "./Pagination";

const TableLayout = ({
  headerData = [],
  mobileHeaderData = [],
  collapseFields = [],
  allData = [],
  sortingList = [],
  defaultSortOn = "createdAt",
  dropdownSearchFields = [],
  dateFilterField = "",
  handleDateChange,
  todayDate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortedColumn, setSortedColumn] = useState(defaultSortOn);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 10,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [dropdownSearch, setDropdownSearch] = useState(
    dropdownSearchFields.reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {})
  );
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  useEffect(() => {
    let data = [...allData];

    if (searchTerm) {
      data = data.filter((row) =>
        headerData.some((header) =>
          row[header.field]?.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    Object.keys(dropdownSearch).forEach((field) => {
      const value = dropdownSearch[field];
      if (value) {
        data = data.filter((row) => row[field] === value);
      }
    });

    if (dateFilterField && (dateRange.from || dateRange.to)) {
      data = data.filter((row) => {
        const dateValue = new Date(row[dateFilterField]);
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;

        return (
          (!fromDate || dateValue >= fromDate) &&
          (!toDate || dateValue <= toDate)
        );
      });
    }

    if (sortedColumn) {
      data.sort((a, b) => {
        const aValue = a[sortedColumn];
        const bValue = b[sortedColumn];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setFilteredData(data.slice(startIndex, endIndex));
    setPagination({
      pageSize: pagination.pageSize,
      currentPage: pagination.currentPage,
      totalPages: Math.ceil(data?.length / pagination.pageSize || 0),
      totalItems: data?.length,
    });
  }, [
    searchTerm,
    dropdownSearch,
    dateRange,
    sortedColumn,
    sortDirection,
    pagination.currentPage,
    pagination.pageSize,
    allData,
    headerData,
    dateFilterField,
  ]);

  return (
    <Box>
      <SearchRow
        headerData={headerData}
        dropdownSearchFields={dropdownSearchFields}
        dropdownSearch={dropdownSearch}
        setDropdownSearch={(updatedSearch) => {
          setDropdownSearch(updatedSearch);
          setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }}
        dateFilterField={dateFilterField}
        dateRange={dateRange}
        setDateRange={(range) => {
          setDateRange(range);
          setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }}
        searchTerm={searchTerm}
        setSearchTerm={(term) => {
          setSearchTerm(term);
          setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }}
        allData={allData}
        handleDateChange={handleDateChange}
        todayDate={todayDate}
      />

      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHeader
            headerData={isMobile ? mobileHeaderData : headerData}
            sortingList={sortingList}
            sortedColumn={sortedColumn}
            sortDirection={sortDirection}
            handleSort={(column) => {
              const isAsc = sortedColumn === column && sortDirection === "asc";
              setSortDirection(isAsc ? "desc" : "asc");
              setSortedColumn(column);
            }}
            isMobile={isMobile}
          />
          <TableRowComponent
            filteredData={filteredData}
            headerData={isMobile ? mobileHeaderData : headerData}
            isMobile={isMobile}
            collapseFields={collapseFields}
          />
        </Table>
      </TableContainer>

      <Pagination
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        setCurrentPage={(newPage) =>
          setPagination((prev) => ({ ...prev, currentPage: newPage }))
        }
        pageSize={pagination.pageSize}
        setPageSize={(newPageSize) =>
          setPagination((prev) => ({ ...prev, pageSize: newPageSize }))
        }
        totalItems={pagination.totalItems}
      />
    </Box>
  );
};

export default TableLayout;
