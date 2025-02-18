import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../../config/Forms/Forms";
import { useAuth } from "../../hooks/useAuth";

import LoginImage from "../../assets/svg/LoginImage.png";

const Login = () => {
  const { token, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        logout();
      } else {
        setTimeout(() => {
          navigate(`/${user?.Role}/dashboard`);
        }, 2000);
      }
    }
  }, [token, user]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        // backgroundColor: "#c2dfff",
        padding: 2,
      }}
    >
      <Card
        sx={{
          display: "flex",
          maxWidth: 900,
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: { xs: "none", md: "block" }, width: "50%" }}>
          <img
            src={LoginImage}
            alt="Login"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "12px 0 0 12px",
            }}
          />
        </Box>
        <Divider orientation="vertical" flexItem />

        <Box sx={{ flex: 1, padding: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              sx={{
                color: "#333",
                fontFamily: "'Roboto', sans-serif",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Login
            </Typography>

            <Box mt={3} mb={2}>
              <LoginForm loading={loading} />
            </Box>

            <Typography
              variant="body2"
              component={Link}
              to="/auth/sign-up"
              align="center"
              sx={{
                color: "#555",
                textAlign: "center",
                mt: 2,
                textDecoration: "none",
                "&:hover": {
                  color: "#000",
                  textDecoration: "underline",
                },
              }}
            >
              Don't have an account? Sign up here!
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
};

export default Login;
