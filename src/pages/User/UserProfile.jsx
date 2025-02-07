import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Grid, Paper, Typography } from "@mui/material";

import Loader from "../../components/Common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { UserProfileForm } from "../../config/Forms/Forms";

const UserProfile = () => {
  const { loading, user, handleUpdate } = useAuth();
  const navigate = useNavigate();

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
          User Profile
        </Typography>
      </Box>

      {loading ? (
        <Loader />
      ) : (
        <Paper
          elevation={3}
          sx={{ padding: 2, marginTop: 2, position: "relative" }}
        >
          <Grid container spacing={2} pb={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="p">Profile Details</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="p">Additional Details</Typography>
            </Grid>
          </Grid>

          <UserProfileForm
            initialValues={user}
            handleSubmit={handleUpdate}
            onClose={() => navigate(-1)}
          />
        </Paper>
      )}
    </Box>
  );
};

export default UserProfile;
