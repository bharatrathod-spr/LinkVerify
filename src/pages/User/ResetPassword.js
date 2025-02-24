import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../actions/userActions";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import ResetPasswordSVG from "../../assets/svg/reset.svg";
import { useFormik } from "formik";
import * as Yup from "yup";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters.")
        .required("Password is required."),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required."),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(resetPassword(token, values.password));
        navigate("/auth/login");
      } catch (error) {
        toast.error(error.response?.data?.error || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });

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
              src={ResetPasswordSVG}
              alt="Reset Password"
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
              Reset Your Password
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "primary.main" }}>
              Create a strong password to secure your account.
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="password"
                sx={{
                  mb: 2,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                }}
                helperText={formik.touched.password && formik.errors.password}
                error={formik.touched.password && !!formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="confirmPassword"
                sx={{
                  mb: 2,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                }}
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                error={
                  formik.touched.confirmPassword &&
                  !!formik.errors.confirmPassword
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                  "Reset Password"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ResetPassword;
