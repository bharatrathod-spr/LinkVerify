import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
import { ChangePasswordForm } from "../../config/Forms/Forms";
import { updatePassword } from "../../actions/userActions";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Common/Loader";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { loading, user } = useAuth();

  const handlePasswordChange = async (formData) => {
    try {
      const userId = user?.UserId;
      await updatePassword(formData, userId);
      navigate("/user/");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
      </Box>
      {loading ? (
        <Loader />
      ) : (
        <Paper
          elevation={3}
          sx={{ padding: 2, marginTop: 2, position: "relative" }}
        >
          <ChangePasswordForm
            handleSubmit={handlePasswordChange}
            onClose={() => navigate(-1)}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ChangePassword;
