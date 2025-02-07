import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useDashboard } from "../../hooks/useDashboard";
import SuccessFailureGraph from "../../components/BarGraphs/SuccessFailureGraph";
import ResponseTimeGraph from "../../components/LineGraphs/ResponseTimeGraph";
import ErrorPannel from "../../components/Pannels/ErrorPannel";
import Loader from "../../components/Common/Loader";

const UserDashboard = () => {
  const { graphdata, pannelData, loading, error } = useDashboard();

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
      </Box>

      {loading ? (
        <Loader />
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            src="../../assets/svg/NoData.png"
            alt="No Data"
            style={{ width: "100px", height: "100px" }}
          />
        </Box>
      ) : (
        <Grid container spacing={3} height="100%">
          <Grid item xs={12} lg={6} mt={1}>
            {graphdata?.successFailureGraph && (
              <SuccessFailureGraph
                data={graphdata?.successFailureGraph}
                title="Daily Success and Failure Breakdown"
              />
            )}
          </Grid>

          <Grid item xs={12} lg={6} mt={1}>
            {graphdata?.responseTimeGraph && (
              <ResponseTimeGraph
                data={graphdata?.responseTimeGraph}
                title="Site-Based Average Response Time for Link Audit"
              />
            )}
          </Grid>

          {pannelData && (
            <Grid item xs={12} lg={12} mt={1}>
              <ErrorPannel errors={pannelData} />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default UserDashboard;
