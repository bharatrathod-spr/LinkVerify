import React from "react";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ErrorPanel = ({ errors }) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <Typography
        variant="body1"
        sx={{ fontWeight: "bold", color: primaryColor, mb: 1 }}
      >
        Recent Errors
      </Typography>

      {errors?.length > 0 ? (
        <Box>
          {errors.slice(0, 10).map((error, index) => (
            <Paper
              key={index}
              sx={{
                p: 1.5,
                mb: 1,
                display: "flex",
                alignItems: "center",
                backgroundColor: "#dfdfff",
                borderLeft: `4px solid ${primaryColor}`,
              }}
            >
              <ErrorOutlineIcon
                sx={{ color: primaryColor, fontSize: 18, mr: 1 }}
              />

              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: primaryColor }}>
                    {error.FailureReasons}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                >
                  <AccessTimeIcon
                    sx={{ fontSize: 12, color: "#757575", mr: 0.5 }}
                  />
                  <Typography variant="caption" sx={{ color: "#757575" }}>
                    {new Date(error.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            mt: 1,
            p: 1,
            backgroundColor: "#E3F2FD",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: primaryColor }}
          >
            ✅ No recent errors
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ErrorPanel;
