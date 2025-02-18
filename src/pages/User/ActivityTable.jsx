import React, { useMemo } from "react";
import { Typography, Box, Paper } from "@mui/material";
import TableLayout from "../../components/Table/TableLayout";
import moment from "moment";
import Loader from "../../components/Common/Loader";
import { useActivity } from "../../hooks/useActivity";

const headerData = [
  { field: "ActivityType", label: "Activity Action", width: "25%" },
  { field: "ActivityMessage", label: "Activity Description", width: "40%" },
  { field: "ActivityBy", label: "Activity By", width: "20%" },
  { field: "createdAt", label: "Created At", width: "15%" },
];

const mobileHeaderData = [
  { field: "ActivityType", label: "Activity Title", width: "35%" },
  { field: "ActivityBy", label: "Activity By", width: "35%" },
  { field: "createdAt", label: "Created At", width: "30%" },
];

const ActivityTable = () => {
  const { activities, loading } = useActivity();

  const transformedData = useMemo(() => {
    return activities?.map((item) => ({
      ...item,
      createdAt: item.createdAt
        ? moment(new Date(item.createdAt)).format("YYYY-MM-DD HH:mm:ss")
        : "",
    }));
  }, [activities]);

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
          My Activities
        </Typography>
      </Box>

      {loading && !activities ? (
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
            sortingList={[
              "ActivityType",
              "ActivityDescription",
              "ActivityBy",
              "createdAt",
            ]}
            defaultSortOn="createdAt"
            dropdownSearchFields={["ActivityType"]}
            dateFilterField=""
            mobileHeaderData={mobileHeaderData}
            collapseFields={headerData}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ActivityTable;
