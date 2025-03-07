import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";

function ResponseTimeGraph({ data, title }) {
  const [activeBar, setActiveBar] = useState(false);

  const profiles = Array.from(
    new Map(
      data.flatMap((item) =>
        Object.keys(item)
          .filter((key) => key.startsWith("Profile-") && item[`${key}_id`])
          .map((key) => [
            key,
            {
              validationProfileId: item[`${key}_id`],
              description: item[`${key}_description`] || key,
            },
          ])
      )
    )
  ).map(([profileKey, { validationProfileId, description }]) => ({
    profileKey,
    validationProfileId,
    description,
  }));

  const transformedData = data.map((item) => {
    const newItem = { ...item };
    profiles.forEach(({ profileKey, description }) => {
      if (item[profileKey] !== undefined) {
        newItem[description] = item[profileKey];
      }
    });
    return newItem;
  });

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const uniquePayload = payload.filter((item, index, self) => {
      return index === self.findIndex((t) => t.name === item.name);
    });

    return (
      <Box
        sx={{
          backgroundColor: "#fff",
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
        {uniquePayload.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: "4px",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
                fontSize: "12px",
              }}
            >
              {`${
                item.name.length > 20
                  ? `${item.name.substring(0, 20)}...`
                  : item.name
              } : ${item.value}`}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderLegend = () => (
    <Box sx={{ flexGrow: 1, px: 2, mt: 2 }}>
      <Grid container spacing={2} justifyContent="start">
        {profiles.map(
          ({ profileKey, validationProfileId, description }, index) => (
            <Grid item key={profileKey} xs={12} sm={6} md={4}>
              <Typography 
                variant="body2"
                component={Link}
                to={"/user/validation-profile-details"}
                state={{ ValidationProfileId: validationProfileId }}
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
                    color: "#1976d2",
                  },
                }}
              >
                {description}
              </Typography>
            </Grid>
          )
        )}
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
          <BarChart
            data={transformedData}
            style={{ cursor: activeBar && "pointer" }}
          >
            <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#000" />
            <YAxis
              domain={[
                0,
                Math.ceil(
                  Math.max(
                    ...data.flatMap((item) =>
                      profiles.map(
                        (profile) => parseFloat(item[profile.profileKey]) || 0
                      )
                    )
                  ) / 100
                ) * 100,
              ]}
              tickFormatter={(value) => Math.ceil(value / 100) * 100}
              stroke="#000"
            />
            <Tooltip content={renderTooltip} />
            <Legend content={renderLegend} />
            {profiles.map(({ description }, index) => (
              <Bar
                key={description}
                dataKey={description}
                fill={`hsl(${((index + 1) * 90) % 360}, 80%, 50%)`}
                onMouseEnter={() => setActiveBar(true)}
                onMouseLeave={() => setActiveBar(false)}
                barSize={15}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default ResponseTimeGraph;
