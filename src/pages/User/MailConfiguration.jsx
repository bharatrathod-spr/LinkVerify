import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import MailConfigModal from "./MailConfigModal";
import useMailConfig from "../../hooks/useMail";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
 
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
    } catch (error) {
      setFilteredConfigs(mailConfigList);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete the mail configuration. Please try again.",
        { autoClose: 5000 }
      );
    }
  };

  return (
    <Box sx={{ margin: "30px", mt: 5 }}>
      <Typography
        variant="h5"
        color="primary"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Mail Configurations
      </Typography>

      <Card elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SearchIcon color="action" />
            <TextField
              label="Search Configurations"
              variant="outlined"
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ width: "250px" }}
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
            onClick={handleAddClick}
            sx={{ fontWeight: "bold" }}
          >
            Add Configuration
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Host</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Port</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Secure</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Mail</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredConfigs.length > 0 ? (
                filteredConfigs.map((config) => (
                  <TableRow
                    key={config.MailConfigurationId}
                    hover
                    sx={{
                      transition: "0.3s",
                      "&:hover": { backgroundColor: "#fafafa" },
                    }}
                  >
                    <TableCell>{config.Host}</TableCell>
                    <TableCell>{config.Port}</TableCell>
                    <TableCell>{config.Secure ? "Yes" : "No"}</TableCell>
                    <TableCell>{config.User}</TableCell>
                    <TableCell>{config.Mail}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        onClick={() => handleEditClick(config)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          handleDeleteClick(config.MailConfigurationId)
                        }
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
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
      </Card>

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
