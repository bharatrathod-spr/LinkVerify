import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMailConfig } from "../../actions/mailConfigActions";
import { updateMailConfig } from "../../actions/settingActions";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import useMailConfig from "../../hooks/useMail";

const MailSetModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const userId = user?.UserId || "";

  const { mailConfigList } = useMailConfig();

  const mailConfigState = useSelector((state) => state.mailConfig) || {};
  const { loading = false, error } = mailConfigState;

  const [selectedConfigId, setSelectedConfigId] = useState("");
  useEffect(() => {
    if (open && userId) {
      dispatch(fetchMailConfig(userId));
    }
  }, [open, dispatch, userId]);

  const handleRadioChange = (configId) => {
    setSelectedConfigId(configId);
  };

  const handleSave = async () => {
    if (!selectedConfigId) {
      toast.error("Please select a mail configuration.");
      return;
    }
    try {
      await dispatch(updateMailConfig({ selectedConfigId }));
      toast.success("Mail configuration updated successfully.");
      handleClose();
    } catch (error) {
      toast.error("Failed to update mail configuration.");
    }
  };

  if (error) {
    toast.error(`Error fetching mail configurations: ${error}`);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", fontSize: 25 }}
      >
        Change Mail Configuration
        <span
          onClick={handleClose}
          style={{
            fontSize: "32px",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          &times;
        </span>
      </DialogTitle>

      <DialogContent sx={{ px: 4 }}>
        <Box
          sx={{
            mb: 2,
            border: "2px solid rgba(50, 69, 103, 1)",
            borderRadius: "10px",
            backgroundColor: "#5951da",
            display: "flex",
            justifyContent: "space-between",
            padding: "8px",
            color: "white",
          }}
        >
          <Box sx={{ flex: 1, textAlign: "center", fontWeight: "600" }}>
            Host
          </Box>
          <Box sx={{ flex: 1, textAlign: "center", fontWeight: "600" }}>
            Port
          </Box>
          <Box sx={{ flex: 1, textAlign: "center", fontWeight: "600" }}>
            Email
          </Box>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 100,
            }}
          >
            <CircularProgress />
          </Box>
        ) : mailConfigList.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              padding: 2,
              fontWeight: "600",
              color: "#5951da",
            }}
          >
            <Typography>No Mail Configurations Available</Typography>
          </Box>
        ) : (
          mailConfigList.map((config) => (
            <Box
              key={config._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "10px",
                padding: 2,
                cursor: "pointer",
                transition: "0.3s ease",
                flex: "1",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              onClick={() => handleRadioChange(config?.MailConfigurationId)}
            >
              <Box>
                <input
                  type="radio"
                  name="mail-config"
                  checked={selectedConfigId === config?.MailConfigurationId}
                  onChange={() =>
                    handleRadioChange(config?.MailConfigurationId)
                  }
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                />
              </Box>

              <Box
                sx={{ flex: 1, textAlign: "center", wordBreak: "break-word" }}
              >
                {config?.Host}
              </Box>

              <Box
                sx={{ flex: 1, textAlign: "center", wordBreak: "break-word" }}
              >
                {config?.Port}
              </Box>

              <Box
                sx={{ flex: 1, textAlign: "center", wordBreak: "break-word" }}
              >
                {config?.User}
              </Box>
            </Box>
          ))
        )}
      </DialogContent>

      <DialogActions sx={{ padding: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClose}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MailSetModal;
