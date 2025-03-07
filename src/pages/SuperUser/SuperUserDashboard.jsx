import React from "react";
import { Box, Typography, Grid, Card, CardContent, Stack } from "@mui/material";
import { useDashboard } from "../../hooks/useDashboard";
import Loader from "../../components/Common/Loader";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SuperUserCard from "../../components/Cards/SuperUserCard";
import { People, PersonOff } from "@mui/icons-material";
import NoDataImage from "../../assets/svg/NoData.png";

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
    <Box sx={{ p: 4, backgroundColor: "#F4F7FC", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Super User Dashboard
          </Typography>
        </Stack>
      </Box>

      {loading ? (
        <Loader />
      ) : error ? (
        <Box sx={{ textAlign: "center" }}>
          <img
            src={NoDataImage}
            alt="No Data"
            style={{ width: "250px", height: "250px" }}
          />
        </Box>
      ) : !graphdata || !Array.isArray(graphdata) ? (
        <Typography variant="body1" align="center">
          Something went wrong, try again!
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                p: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  Users Growth Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={graphdata}
                    margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorThisYear"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorLastYear"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#FF7043"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FF7043"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis
                      domain={[0, domainMax]}
                      ticks={ticks}
                      stroke="#6B7280"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="thisYear"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorThisYear)"
                    />
                    <Area
                      type="monotone"
                      dataKey="lastYear"
                      stroke="#FF7043"
                      fillOpacity={1}
                      fill="url(#colorLastYear)"
                    />
                  </AreaChart>
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
