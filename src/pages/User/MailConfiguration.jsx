import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import MailConfigModal from "./MailConfigModal";
import useMailConfig from "../../hooks/useMail";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const MailConfiguration = () => {
  const { mailConfigList, handleDeleteMailConfig } = useMailConfig();
  const { user } = useAuth();
  const userId = user?.UserId;

  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [editConfigId, setEditConfigId] = useState(null);

  const [filter, setFilter] = useState("");
  const [filteredConfigs, setFilteredConfigs] = useState([]);

  useEffect(() => {
    setFilteredConfigs(
      mailConfigList?.filter((config) =>
        [config?.Host, config?.User, config?.Mail].some((field) =>
          field?.toLowerCase().includes(filter.toLowerCase())
        )
      ) || []
    );
  }, [mailConfigList, filter]);

  const handleAddClick = () => {
    setOpen(true);
    setEditConfigId(null);
  };

  const handleEditClick = (config) => {
    setEditConfigId(config.MailConfigurationId);
    setOpen(true);
  };

  const handleDeleteClick = (configId) => {
    setSelectedConfigId(configId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setOpenDeleteDialog(false);

      toast.success("Mail configuration deleted successfully!");

      setFilteredConfigs((prev) =>
        prev.filter((config) => config.MailConfigurationId !== selectedConfigId)
      );

      await handleDeleteMailConfig(selectedConfigId);
      toast.success("Mail configuration deleted successfully!", {
        autoClose: 3000,
      });
    } catch (error) {
      setFilteredConfigs(mailConfigList);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete the mail configuration. Please try again.";
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
    }
  };

  return (
    <Box sx={{ margin: "30px", mt: 5 }}>
      <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
        Mail Configurations
      </Typography>

      <TextField
        label="Filter"
        variant="outlined"
        size="small"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2, width: "300px" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        sx={{ float: "right", mb: 5 }}
      >
        Add New Mail Configuration
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Host</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Secure</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Mail</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConfigs.length > 0 ? (
              filteredConfigs.map((config) => (
                <TableRow key={config.MailConfigurationId}>
                  <TableCell>{config.Host}</TableCell>
                  <TableCell>{config.Port}</TableCell>
                  <TableCell>{config.Secure ? "Yes" : "No"}</TableCell>
                  <TableCell>{config.User}</TableCell>
                  <TableCell>{config.Mail}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditClick(config)}>
                      Edit
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteClick(config.MailConfigurationId)
                      }
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No mail configurations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this mail configuration?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <MailConfigModal
        open={open}
        handleClose={() => setOpen(false)}
        userId={userId}
        configId={editConfigId}
      />
    </Box>
  );
};

export default MailConfiguration;
