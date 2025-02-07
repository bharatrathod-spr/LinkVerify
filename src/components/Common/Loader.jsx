import { Box } from "@mui/material";
import React from "react";

const Loader = ({ height = "300px", color = "#6e8efb" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", gap: "8px" }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
            animation: "dotPulse 1.2s infinite ease-in-out",
            animationDelay: "0s",
          }}
        />
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
            animation: "dotPulse 1.2s infinite ease-in-out",
            animationDelay: "0.2s",
          }}
        />
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
            animation: "dotPulse 1.2s infinite ease-in-out",
            animationDelay: "0.4s",
          }}
        />
      </Box>

      <style>
        {`
          @keyframes dotPulse {
            0% {
              transform: scale(1);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.5);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0.6;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Loader;
