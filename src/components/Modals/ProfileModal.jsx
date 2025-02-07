import { Dialog, DialogContent, DialogTitle } from "@mui/material";
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

    return () => {};
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
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
    >
      {loading && !selectedProfile ? (
        <Loader />
      ) : (
        <DialogContent>
          <DialogTitle
            id="profile-modal-title"
            sx={{ px: 0, pt: 0 }}
            variant="h6"
          >
            {selectedProfile
              ? "Edit URL Audit Profile"
              : "Add URL Audit Profile"}
          </DialogTitle>
          <ProfileForm
            initialValues={selectedProfile}
            onClose={onClose}
            handleSubmit={(values) => {
              if (profileId)
                handleUpdate(profileId, {
                  ...values,
                  CronExpression: `${values.cronExpression?.occurrence || ""} ${
                    values.cronExpression?.period || ""
                  }`,
                });
              else
                handleCreate({
                  ...values,
                  CronExpression: `${values.cronExpression?.occurrence || ""} ${
                    values.cronExpression?.period || ""
                  }`,
                });
              onClose();
            }}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ProfileModal;
