import React, { useEffect, useMemo, useState } from "react";
import { Typography, Box, Paper, Stack } from "@mui/material";
import TableLayout from "../../components/Table/TableLayout";
import moment from "moment";
import { useLogs } from "../../hooks/useLogs";
import Loader from "../../components/Common/Loader";
import HistoryIcon from "@mui/icons-material/History";
const headerData = [
  { field: "SourceLink", label: "Source Link", width: "18%", isOverflow: true },
  { field: "SearchLink", label: "Search Link", width: "18%", isOverflow: true },
  {
    field: "FailureReasons",
    label: "Error Message",
    width: "21%",
    isOverflow: true,
  },
  { field: "Follow", label: "Is Follow", width: "10%" },
  { field: "Index", label: "Is Index", width: "10%" },
  { field: "IsSuccess", label: "Is Success", width: "10%" },
  { field: "createdAt", label: "Created At", width: "13%" },
];

const mobileHeaderData = [
  { field: "SourceLink", label: "Source Link", width: "35%" },
  { field: "SearchLink", label: "Search Link", width: "35%" },
  { field: "createdAt", label: "Created At", width: "30%" },
];

const formatFailureReasons = (reasons) => {
  if (!Array.isArray(reasons) || reasons.length === 0) return "-";
  return reasons.map((reason, index) => (
    <React.Fragment key={index}>
      {reason}
      {index < reasons.length - 1 && <br />}
    </React.Fragment>
  ));
};

const LogsTable = () => {
  const { logs, loading, updateDate } = useLogs();

  const transformedData = useMemo(() => {
    return logs?.map((item) => ({
      ...item,
      createdAt: item.createdAt
        ? moment.utc(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
        : "",
      FailureReasons: formatFailureReasons(item?.FailureReasons),
    }));
  }, [logs]);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    updateDate(selectedDate);
  }, [selectedDate]);

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="h5"
            gutterBottom
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            Audit Logs
          </Typography>
        </Stack>
      </Box>

      {loading && !logs ? (
        <>
          <Loader />
        </>
      ) : (
        <Paper
          elevation={3}
          sx={{ padding: 2, marginTop: 2, position: "relative" }}
        >
          <TableLayout
            headerData={headerData}
            allData={transformedData}
            handleDateChange={handleDateChange}
            todayDate={selectedDate}
            sortingList={[
              "SourceLink",
              "SearchLink",
              "Follow",
              "Index",
              "LastSuccessAt",
              "createdAt",
            ]}
            defaultSortOn="createdAt"
            dropdownSearchFields={["SourceLink", "SearchLink"]}
            dateFilterField=""
            mobileHeaderData={mobileHeaderData}
            collapseFields={headerData.map((header) => header.field)}
          />
        </Paper>
      )}
    </Box>
  );
};

export default LogsTable;
