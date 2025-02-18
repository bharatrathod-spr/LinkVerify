import React from "react";
import { Box, Typography, Grid, Card, CardContent, Stack } from "@mui/material";
import { useDashboard } from "../../hooks/useDashboard";
import Loader from "../../components/Common/Loader";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SuperUserCard from "../../components/Cards/SuperUserCard";
import { People, PersonOff } from "@mui/icons-material";
import NoDataImage from "../../assets/svg/NoData.png";
import WidgetsRounded from "@mui/icons-material/WidgetsRounded";


const SuperUserDashboard = () => {
  const { graphdata, loading, error, userCount } = useDashboard();

  const maxCount =
    Array.isArray(graphdata) && graphdata.length > 0
      ? Math.max(...graphdata.map((item) => item?.thisYear))
      : 10;

  const domainMax = maxCount + (10 - (maxCount % 10));
  const ticks = Array.from(
    { length: domainMax / 1 + 1 },
    (_, index) => index * 1
  );

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <WidgetsRounded sx={{ color: "#1976d2", fontSize: 28 }} />
          <Typography variant="h5" gutterBottom>
            Dashboard
          </Typography>
        </Stack>
      </Box>

      {loading ? (
        <Loader />
      ) : error ? (
        <Typography variant="body1" align="center">
          <img
            src={NoDataImage}
            alt="No Data"
            style={{ width: "200px", height: "250px" }}
          />
        </Typography>
      ) : !graphdata || !Array.isArray(graphdata) ? (
        <Typography variant="body1" align="center">
          Something went wrong, try again!
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Users Counts by Month</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={graphdata}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      domain={[0, domainMax]}
                      ticks={ticks}
                      // allowDecimals={false}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="thisYear" stackId="a" fill="#8884d8" />
                    <Bar dataKey="lastYear" stackId="a" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <SuperUserCard
              label={"Active Users"}
              count={userCount?.active}
              icons={<People />}
            />
            <SuperUserCard
              label={"Inactive Users"}
              count={userCount?.inactive}
              icons={<PersonOff color="warning" />}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SuperUserDashboard;
