import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import axiosInstance from "../../helpers/axiosInstance";
import { jwtDecode } from "jwt-decode";

const MailConfigModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    secure: false,
    user: "",
    pass: "",
  });

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded?.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    if (!userId || !open) return;

    const fetchMailConfig = async () => {
      try {
        const { data } = await axiosInstance.get(`/mail-config/${userId}`);
        if (data?.result) {
          setFormData(data.result);
        }
      } catch (error) {
        console.error("Error fetching mail config:", error);
      }
    };

    fetchMailConfig();
  }, [open, userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      await axiosInstance.post("/mail-config", { ...formData, userId });
      toast.success("Mail configuration updated successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to update mail configuration.");
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "white",
          width: 400,
          margin: "auto",
          mt: 10,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Mail Configuration</Typography>

        <TextField
          label="Host"
          name="host"
          fullWidth
          margin="normal"
          value={formData.host}
          onChange={handleChange}
        />
        <TextField
          label="Port"
          name="port"
          fullWidth
          margin="normal"
          value={formData.port}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.secure}
              onChange={handleChange}
              name="secure"
            />
          }
          label="Secure Connection (SSL)"
        />
        <TextField
          label="User"
          name="user"
          fullWidth
          margin="normal"
          value={formData.user}
          onChange={handleChange}
        />
        <TextField
          type="password"
          label="Password"
          name="pass"
          fullWidth
          margin="normal"
          value={formData.pass}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default MailConfigModal;
