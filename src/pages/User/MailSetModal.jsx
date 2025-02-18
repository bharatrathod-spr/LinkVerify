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
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMailTable } from "../../actions/mailConfigActions";
import { updateMailConfigurations } from "../../actions/mailConfigActions";
import { deleteMailConfig } from "../../actions/mailConfigActions";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import useMailConfig from "../../hooks/useMail";
import MailConfigModal from "./MailConfigModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const MailSetModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const userId = user?.UserId || "";

  const { mailConfigList, handleDeleteMailConfig } = useMailConfig();
  const { loading, error } = useSelector((state) => state.mailConfig) || {};

  const [selectedConfigId, setSelectedConfigId] = useState("");
  const [isMailConfigModalOpen, setIsMailConfigModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [filteredConfigs, setFilteredConfigs] = useState([]);

  useEffect(() => {
    if (open && userId) {
      dispatch(fetchMailTable(userId));
    }
  }, [open, userId, dispatch]);

  const handleRadioChange = (configId) => {
    setSelectedConfigId(configId);
  };

  const handleSave = async () => {
    if (!selectedConfigId) {
      toast.error("Please select a mail configuration.");
      return;
    }
    const updatedConfig = {
      Host: "",
      Port: "",
      Secure: false,
      User: "",
      Password: "",
      Mail: "",
    };

    try {
      await dispatch(
        updateMailConfigurations({ selectedConfigId, updatedConfig })
      );
      toast.success("Mail configuration updated successfully.");
      handleClose();
    } catch (error) {
      toast.error("Failed to update mail configuration.");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleteConfirmOpen(false);
      toast.success("Mail configuration deleted successfully!");
      setFilteredConfigs((prev) =>
        prev.filter((config) => config.MailConfigurationId !== selectedConfigId)
      );
      await handleDeleteMailConfig(selectedConfigId);
    } catch (error) {
      setFilteredConfigs(mailConfigList);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete the mail configuration. Please try again.",
        { autoClose: 5000 }
      );
    }
  };

  const handleAddMailConfigClick = () => {
    setIsMailConfigModalOpen(true);
  };

  const handleCloseMailConfigModal = () => {
    setIsMailConfigModalOpen(false);
  };

  const handleDeleteConfirmOpen = (configId) => {
    setSelectedConfigId(configId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedConfigId("");
  };

  if (error) {
    toast.error(`Error fetching mail configurations: ${error}`);
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 25,
          }}
        >
          Change Mail Configuration
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMailConfigClick}
            sx={{ mt: 2 }}
          >
            Add Mail Configuration
          </Button>
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
            <Box sx={{ flex: 1, textAlign: "center", fontWeight: "600" }}>
              Actions
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
                onClick={() => handleRadioChange(config.MailConfigurationId)}
              >
                <Box>
                  <input
                    type="radio"
                    name="mail-config"
                    checked={selectedConfigId === config.MailConfigurationId}
                    onChange={() =>
                      handleRadioChange(config.MailConfigurationId)
                    }
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
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

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={() => {
                      setSelectedConfigId(config.MailConfigurationId);
                      setIsMailConfigModalOpen(true);
                    }}
                    sx={{ color: "#5951da" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleDeleteConfirmOpen(config.MailConfigurationId)
                    }
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
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

      <Dialog open={isDeleteConfirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this mail configuration?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteConfirmClose}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <MailConfigModal
        open={isMailConfigModalOpen}
        handleClose={handleCloseMailConfigModal}
        userId={userId}
        configId={selectedConfigId}
      />
    </>
  );
};

export default MailSetModal;
