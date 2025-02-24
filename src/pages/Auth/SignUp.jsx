import React, { useEffect } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { SignUpForm } from "../../config/Forms/Forms";
import { useAuth } from "../../hooks/useAuth";

import SignUpImage from "../../assets/svg/SignUpImage.svg";

const SignUp = () => {
  const { loading, token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      setTimeout(() => {
        navigate(`/user/dashboard`);
      }, 2000);
    }
  }, [token, user]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "none",
        padding: 2,
      }}
    >
      <Card sx={{ display: "flex", maxWidth: 1400, borderRadius: 3 }}>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            width: "28%",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            // paddingTop: 2,
          }}
        >
          <img
            src={SignUpImage}
            alt="Sign Up"
            style={{
              width: "450px",
              // height: "100%",
              objectFit: "contain",
              borderRadius: "12px 0 0 12px",
              alignSelf: "flex-start",
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
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Sign Up
            </Typography>

            <Box mt={3} mb={1}>
              <SignUpForm loading={loading} />
            </Box>

            <Typography
              variant="body2"
              component={Link}
              to="/auth/login"
              align="center"
              sx={{ display: "block", textAlign: "center", mt: 2 }}
            >
              Already have an account? Login
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
};

export default SignUp;
