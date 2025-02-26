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
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Table,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMailConfig,
  fetchMailTable,
} from "../../actions/mailConfigActions";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import useMailConfig from "../../hooks/useMail";
import MailConfigModal from "./MailConfigModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddCircleOutline } from "@mui/icons-material";
import {
  updateMailConfig,
  toggleSubscription,
  fetchUserAlerts,
} from "../../actions/settingActions";
import Tooltip from "@mui/material/Tooltip";

const MailSetModal = ({ open, handleClose, setSubscriptionState }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const userId = user?.UserId || "";

  const { mailConfigList, handleDeleteMailConfig } = useMailConfig();
  const { loading, error } = useSelector((state) => state.mailConfig) || {};

  const [selectedConfigId, setSelectedConfigId] = useState("");
  const [isMailConfigModalOpen, setIsMailConfigModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (open && userId) {
      dispatch(fetchMailTable(userId));
    }
  }, [open, userId, dispatch]);

  useEffect(() => {
    if (mailConfigList.length > 0) {
      setSelectedConfigId(mailConfigList[0].MailConfigurationId);
    }
  }, [mailConfigList]);

  const handleRadioChange = (configId) => {
    setSelectedConfigId(configId);
  };

  const handleMailSave = async () => {
    if (!selectedConfigId) {
      toast.error("Please select a mail configuration.");
      return;
    }
    try {
      await dispatch(updateMailConfig({ selectedConfigId }));
      toast.success("Mail configuration and subscription updated successfully.");

      const response = await dispatch(fetchUserAlerts(userId));

      const userAlerts = response?.payload || {};

      const emailAlert = userAlerts?.Email;

      if (emailAlert && emailAlert.Subscriber === false) {
        await dispatch(toggleSubscription("email"));
        // toast.success("Subscription successful!");
        setSubscriptionState((prev) => ({ ...prev, Email: true }));
      } else {
        // console.log("Skipping toggleSubscription, Subscriber is already true.");
      }

      handleClose();
    } catch (error) {
      console.error("Error in handleMailSave:", error);
      toast.error("Failed to update mail configuration or subscribe.");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleteConfirmOpen(false);
      await handleDeleteMailConfig(selectedConfigId);
      dispatch(fetchMailConfig(userId));
    } catch (error) {
      toast.error("Failed to delete the mail configuration. Please try again.");
    }
  };

  const handleAddMailConfigClick = () => {
    setSelectedConfigId("");
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
            startIcon={<AddCircleOutline />}
            onClick={handleAddMailConfigClick}
            sx={{ mt: 2 }}
          >
            Add Mail Configuration
          </Button>
        </DialogTitle>

        <DialogContent sx={{ px: 4 }}>
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#5951da" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Select
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Host
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Port
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mailConfigList.map((config) => (
                    <TableRow key={config._id} hover>
                      <TableCell>
                        <input
                          type="radio"
                          name="mail-config"
                          checked={
                            selectedConfigId === config.MailConfigurationId
                          }
                          onChange={() =>
                            handleRadioChange(config.MailConfigurationId)
                          }
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                          }}
                        />
                      </TableCell>
                      <TableCell>{config?.Host}</TableCell>
                      <TableCell>{config?.Port}</TableCell>
                      <TableCell>
                        <Tooltip title={config?.User} arrow>
                          <Box
                            sx={{
                              wordBreak: "break-word",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {config?.User}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
          <Button variant="contained" color="primary" onClick={handleMailSave}>
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
