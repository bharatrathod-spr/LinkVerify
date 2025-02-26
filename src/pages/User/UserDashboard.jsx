import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useDashboard } from "../../hooks/useDashboard";
import SuccessFailureGraph from "../../components/BarGraphs/SuccessFailureGraph";
import ResponseTimeGraph from "../../components/LineGraphs/ResponseTimeGraph";
import ErrorPannel from "../../components/Pannels/ErrorPannel";
import Loader from "../../components/Common/Loader";
import { useAuth } from "../../hooks/useAuth";

const UserDashboard = () => {
  const { graphdata, pannelData, loading, error } = useDashboard();
  const { user } = useAuth();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "8px",
          animation: isVisible ? "fadeIn 1s ease-in-out" : "none",
        }}
      >
        <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
          Dashboard
        </Typography>
        <Typography variant="body2">
          Welcome back,{" "}
          {user?.FirstName
            ? `${user.FirstName} ${user.LastName || ""}`
            : "User"}{" "}
          👋
        </Typography>
      </Paper>

      {loading ? (
        <Loader />
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            mt: 5,
            animation: isVisible ? "fadeIn 1s ease-in-out" : "none",
          }}
        >
          <img
            src="../../assets/svg/NoData.png"
            alt="No Data"
            style={{ width: "80px", height: "80px" }}
          />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              animation: isVisible ? "slideUp 0.8s ease-in-out" : "none",
            }}
          >
            <Paper>
              {graphdata?.successFailureGraph && (
                <SuccessFailureGraph
                  data={graphdata?.successFailureGraph}
                  title="Success vs Failure (Daily)"
                />
              )}
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              animation: isVisible ? "slideUp 0.9s ease-in-out" : "none",
            }}
          >
            <Paper>
              {graphdata?.responseTimeGraph && (
                <ResponseTimeGraph
                  data={graphdata?.responseTimeGraph}
                  title="Avg. Response Time (Link Audit)"
                />
              )}
            </Paper>
          </Grid>

          {pannelData && (
            <Grid
              item
              xs={12}
              sx={{
                animation: isVisible ? "slideUp 1s ease-in-out" : "none",
              }}
            >
              <Paper elevation={3} sx={{ p: 2 }}>
                <ErrorPannel errors={pannelData} />
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default UserDashboard;
