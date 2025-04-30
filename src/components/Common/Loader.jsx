import { Box } from "@mui/material";
import React from "react";
import logo from "../../assets/svg/logo.png";

const LogoLoader = ({ height = "300px" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "50px",
          height: "50px",
          backgroundImage: `url(${logo})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          animation:
            "rotate 3s linear infinite, bounce 1.5s infinite, glow 2s infinite alternate",
        }}
      />

      <Box sx={{ display: "flex", gap: "6px", mt: 2 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#6e8efb",
            animation: "dotBounce 1.4s infinite ease-in-out",
            animationDelay: "0s",
          }}
        />
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#6e8efb",
            animation: "dotBounce 1.4s infinite ease-in-out",
            animationDelay: "0.2s",
          }}
        />
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#6e8efb",
            animation: "dotBounce 1.4s infinite ease-in-out",
            animationDelay: "0.4s",
          }}
        />
      </Box>

      <style>
        {`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes glow {
            0% {
              filter: drop-shadow(0px 0px 5px rgba(110, 142, 251, 0.5));
            }
            100% {
              filter: drop-shadow(0px 0px 15px rgba(110, 142, 251, 1));
            }
          }

          @keyframes dotBounce {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.5;
            }
            50% {
              transform: translateY(-6px);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LogoLoader;
