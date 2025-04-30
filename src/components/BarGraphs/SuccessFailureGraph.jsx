import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material/styles";

function SuccessFailureGraph({ data, title }) {
  const [activeLine, setActiveLine] = useState(false);
  const theme = useTheme();

  const uniqueProfiles = Object.keys(data[0] || {})
    .filter(
      (key) =>
        key !== "date" && !key.includes("_id") && !key.includes("_description")
    )
    .map((profile) => {
      const idKey = `${profile}_id`;
      const profileKey = `${profile}_description`;
      const firstMatch = data.find((item) => item[idKey]);
      const newProfile = data.find((item) => item[profileKey]);
      return {
        profile,
        label: newProfile ? newProfile[profileKey] : null,
        id: firstMatch ? firstMatch[idKey] : null,
      };
    });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const uniquePayload = payload.filter((item) => item.value !== 0);
      if (!uniquePayload.length) return null;

      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 3,
            padding: "8px 16px",
            fontSize: "14px",
            maxWidth: "200px",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {label}
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", marginTop: "4px" }}
          >
            {uniquePayload.map((item, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
                  fontSize: "12px",
                }}
              >
                {`${item.payload[`${item.name}_description`]?.substring(
                  0,
                  15
                )}${
                  item.payload[`${item.name}_description`]?.length > 15
                    ? "..."
                    : ""
                } : ${item.value}`}
              </Typography>
            ))}
          </Box>
        </Box>
      );
    }
    return null;
  };

  const renderLegend = () => (
    <Box sx={{ flexGrow: 1, px: 2, mt: 2 }}>
      <Grid container spacing={2} justifyContent="start">
        {uniqueProfiles.map(({ profile, id, label }, index) => (
          <Grid item key={profile} xs={12} sm={6} md={4}>
            <Typography
              variant="body2"
              component={Link}
              to="/user/my-backlinks-details"
              state={{ ValidationProfileId: id }}
              sx={{
                display: "block",
                cursor: "pointer",
                textAlign: "start",
                color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, padding: 2 }}>
      <CardContent>
        <Typography
          variant="h6"
          mb={2}
          sx={{ fontWeight: "bold", fontSize: "18px" }}
        >
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
            />
            <XAxis dataKey="date" stroke={theme.palette.text.primary} />
            <YAxis stroke={theme.palette.text.primary} />

            <Tooltip content={<CustomTooltip />} />

            <Legend content={renderLegend} />

            {uniqueProfiles.map(({ profile }, index) => (
              <Line
                key={profile}
                type="monotone"
                dataKey={profile}
                stroke={`hsl(${((index + 1) * 90) % 360}, 80%, 50%)`}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                onMouseEnter={() => setActiveLine(true)}
                onMouseLeave={() => setActiveLine(false)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default SuccessFailureGraph;
