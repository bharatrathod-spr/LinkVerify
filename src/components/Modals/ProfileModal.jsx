import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import React, { useEffect } from "react";
import { ProfileForm } from "../../config/Forms/Forms";
import { useProfile } from "../../hooks/useProfile";
import Loader from "../Common/Loader";

const ProfileModal = ({ open, onClose, profileId }) => {
  const {
    selectProfile,
    deselectProfile,
    handleCreate,
    handleUpdate,
    selectedProfile,
    loading,
  } = useProfile();

  useEffect(() => {
    if (profileId) {
      selectProfile(profileId);
    } else {
      deselectProfile();
    }
  }, [profileId]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        deselectProfile();
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: 8, overflow: "hidden" },
      }}
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
    >
      <Box
        sx={{
          width: "100%",
          height: 5,
          backgroundColor: "primary.main",
        }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, pt: 2 }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            id="profile-modal-title"
            variant="h6"
            fontWeight="bold"
            color="primary"
            sx={{ display: "inline-block", pb: 0.5 }}
          >
            {selectedProfile
              ? "Edit URL Audit Profile"
              : "Add URL Audit Profile"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "text.primary" }}>
          <Close />
        </IconButton>
      </Stack>

      <DialogContent sx={{ p: 3 }}>
        {loading && !selectedProfile ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <ProfileForm
            initialValues={selectedProfile}
            onClose={onClose}
            handleSubmit={(values) => {
              const profileData = {
                ...values,
                CronExpression: `${values.cronExpression?.occurrence || ""} ${
                  values.cronExpression?.period || ""
                }`,
              };
              profileId
                ? handleUpdate(profileId, profileData)
                : handleCreate(profileData);
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
