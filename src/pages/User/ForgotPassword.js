import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import ForgotPasswordSVG from "../../assets/svg/forgotpass.svg";
import { useFormik } from "formik";
import * as Yup from "yup";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(forgotPassword(values.email));
        toast.success("Password reset link sent to your email.");
        navigate("/auth/login");
      } catch (error) {
        toast.error(error.response?.data?.error || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });

  const [loading, setLoading] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Card
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 900,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        //   background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ width: { xs: "80%", md: "50%" }, mb: { xs: 2, md: 0 } }}>
            <img
              src={ForgotPasswordSVG}
              alt="Forgot Password"
              style={{ width: "100%" }}
            />
          </Box>
          <Divider orientation="vertical" flexItem />

          <Box sx={{ width: { xs: "100%", md: "50%", padding: "15px" } }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mb: 2,
                color: "primary.main",
                textTransform: "uppercase",
              }}
            >
              Forgot Password?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "primary.main" }}>
              Enter your email, and we'll send you a reset link.
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="Enter your email"
                fullWidth
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
                sx={{
                  mb: 2,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                }}
                helperText={formik.touched.email && formik.errors.email}
                error={formik.touched.email && !!formik.errors.email}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  color: "#fff",
                  fontWeight: "bold",
                  p: 1.5,
                  borderRadius: 1,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.2)",
                  },
                }}
                fullWidth
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2, color: "primary.main", fontWeight: "bold" }}
              onClick={() => navigate("/auth/login")}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
