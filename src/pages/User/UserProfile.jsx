import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  Fade,
} from "@mui/material";
import Loader from "../../components/Common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { UserProfileForm } from "../../config/Forms/Forms";

const UserProfile = () => {
  const { loading, user, handleUpdate } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 4 }}>
      <Fade in timeout={500}>
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            User Profile
          </Typography>
        </Box>
      </Fade>

      {loading ? (
        <Loader />
      ) : (
        <Fade in timeout={800}>
          <Paper
            elevation={3}
            sx={{ padding: 2, marginTop: 2, position: "relative" }}
          >
            <Avatar
              src={user?.profileImage || "/default-avatar.png"}
              alt="User Avatar"
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                bgcolor: "primary.main",
                fontSize: 32,
              }}
            >
              {user?.FirstName?.charAt(0) || "U"}
            </Avatar>

            <Typography variant="h5" fontWeight="bold" color="primary">
              {user?.FirstName} {user?.LastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.EmailAddress}
            </Typography>

            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} pb={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">Profile Details</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">Additional Details</Typography>
              </Grid>
            </Grid>

            <UserProfileForm
              initialValues={user}
              handleSubmit={handleUpdate}
              onClose={() => navigate(-1)}
            />
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default UserProfile;
