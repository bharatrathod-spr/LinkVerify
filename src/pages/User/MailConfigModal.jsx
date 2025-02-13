// //MailConfigModal.jsx

// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import useMailConfig from "../../hooks/useMail";
// import { useAuth } from "../../hooks/useAuth";

// const MailConfigModal = ({ open, handleClose, userId }) => {
//   const { handleAddMailConfig, loading } = useMailConfig();
//   const { user } = useAuth();

//   const [formData, setFormData] = useState({
//     Host: "",
//     Port: "",
//     Secure: false,
//     User: "",
//     Password: "",
//     Mail: "",
//     UserId: user.UserId,
//   });

//   const [errors, setErrors] = useState({
//     Host: "",
//     Port: "",
//     User: "",
//     Password: "",
//     Mail: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (!open) {
//       setFormData({
//         Host: "",
//         Port: "",
//         Secure: false,
//         User: "",
//         Password: "",
//         Mail: "",
//         UserId: user.UserId,
//       });
//       setErrors({ Host: "", Port: "", User: "", Password: "", Mail: "" });
//     }
//   }, [open, user.UserId]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.Host) newErrors.Host = "Host is required";
//     if (!formData.Port) newErrors.Port = "Port is required";
//     if (!formData.User) newErrors.User = "User is required";
//     if (!formData.Password) newErrors.Password = "Password is required";
//     if (!formData.Mail) newErrors.Mail = "Mail is required";

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       await handleAddMailConfig(formData);
//       toast.success("Mail configuration added successfully!");
//       handleClose();
//     } catch (error) {
//       toast.error("Failed to add mail configuration.");
//       console.error(error);
//     }
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box
//         sx={{
//           p: 4,
//           backgroundColor: "white",
//           width: 450,
//           margin: "auto",
//           mt: 10,
//           borderRadius: 3,
//           boxShadow: 3,
//         }}
//       >
//         <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
//           Add Mail Configuration
//         </Typography>
//         <Typography variant="body2" sx={{ color: "text.secondary" }}>
//           Set your SMTP Mail Configuration settings here.
//         </Typography>

//         <TextField
//           label="Host"
//           name="Host"
//           fullWidth
//           margin="normal"
//           value={formData.Host}
//           onChange={handleChange}
//           error={!!errors.Host}
//           helperText={errors.Host}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//           }}
//         />

//         <TextField
//           label="Port"
//           name="Port"
//           fullWidth
//           margin="normal"
//           value={formData.Port}
//           onChange={handleChange}
//           error={!!errors.Port}
//           helperText={errors.Port}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//           }}
//         />

//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={formData.Secure}
//               onChange={handleChange}
//               name="Secure"
//               sx={{
//                 "& .MuiSvgIcon-root": {
//                   fontSize: 22,
//                 },
//               }}
//             />
//           }
//           label="Secure Connection (SSL)"
//         />

//         <TextField
//           label="Mail"
//           name="Mail"
//           fullWidth
//           margin="normal"
//           value={formData.Mail}
//           onChange={handleChange}
//           error={!!errors.Mail}
//           helperText={errors.Mail}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//           }}
//         />

//         <TextField
//           label="User"
//           name="User"
//           fullWidth
//           margin="normal"
//           value={formData.User}
//           onChange={handleChange}
//           error={!!errors.User}
//           helperText={errors.User}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//           }}
//         />

//         <TextField
//           label="Password"
//           name="Password"
//           fullWidth
//           margin="normal"
//           value={formData.Password}
//           onChange={handleChange}
//           error={!!errors.Password}
//           helperText={errors.Password}
//           type={showPassword ? "text" : "password"}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   onClick={() => setShowPassword(!showPassword)}
//                   edge="end"
//                 >
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//           }}
//         />

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleSubmit}
//           disabled={loading}
//           sx={{
//             mt: 3,
//             borderRadius: 2,
//           }}
//         >
//           {loading ? "Saving..." : "Save"}
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default MailConfigModal;

import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useMailConfig from "../../hooks/useMail";
import { useAuth } from "../../hooks/useAuth";

const MailConfigModal = ({ open, handleClose, userId, configId }) => {
  const {
    mailConfigList,
    handleAddMailConfig,
    handleUpdateMailConfig,
    loading,
  } = useMailConfig();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    Host: "",
    Port: "",
    Secure: false,
    User: "",
    Password: "",
    Mail: "",
    UserId: user.UserId,
  });

  const [errors, setErrors] = useState({
    Host: "",
    Port: "",
    User: "",
    Password: "",
    Mail: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (configId) {
      const existingConfig = mailConfigList.find(
        (config) => config.MailConfigurationId === configId
      );
      if (existingConfig) {
        setFormData(existingConfig);
      }
    }
    if (!open) {
      setFormData({
        Host: "",
        Port: "",
        Secure: false,
        User: "",
        Password: "",
        Mail: "",
        UserId: user.UserId,
      });
      setErrors({ Host: "", Port: "", User: "", Password: "", Mail: "" });
    }
  }, [open, configId, mailConfigList]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Host) newErrors.Host = "Host is required";
    if (!formData.Port) newErrors.Port = "Port is required";
    if (!formData.User) newErrors.User = "User is required";
    if (!formData.Password) newErrors.Password = "Password is required";
    if (!formData.Mail) newErrors.Mail = "Mail is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (configId) {
        await handleUpdateMailConfig(formData);
        toast.success("Mail configuration updated successfully!");
      } else {
        await handleAddMailConfig(formData);
        toast.success("Mail configuration added successfully!");
      }
      handleClose();
    } catch (error) {
      toast.error("Failed to save mail configuration.");
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "white",
          width: 450,
          margin: "auto",
          mt: 10,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          {configId ? "Edit Mail Configuration" : "Add Mail Configuration"}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Set your SMTP Mail Configuration settings here.
        </Typography>

        {/* Form Fields */}
        <TextField
          label="Host"
          name="Host"
          fullWidth
          margin="normal"
          value={formData.Host}
          onChange={handleChange}
          error={!!errors.Host}
          helperText={errors.Host}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <TextField
          label="Port"
          name="Port"
          fullWidth
          margin="normal"
          value={formData.Port}
          onChange={handleChange}
          error={!!errors.Port}
          helperText={errors.Port}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.Secure}
              onChange={handleChange}
              name="Secure"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 22,
                },
              }}
            />
          }
          label="Secure Connection (SSL)"
        />
        <TextField
          label="Mail"
          name="Mail"
          fullWidth
          margin="normal"
          value={formData.Mail}
          onChange={handleChange}
          error={!!errors.Mail}
          helperText={errors.Mail}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <TextField
          label="User"
          name="User"
          fullWidth
          margin="normal"
          value={formData.User}
          onChange={handleChange}
          error={!!errors.User}
          helperText={errors.User}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <TextField
          label="Password"
          name="Password"
          fullWidth
          margin="normal"
          value={formData.Password}
          onChange={handleChange}
          error={!!errors.Password}
          helperText={errors.Password}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            mt: 3,
            borderRadius: 2,
          }}
        >
          {loading ? "Saving..." : configId ? "Update" : "Save"}
        </Button>
      </Box>
    </Modal>
  );
};

export default MailConfigModal;
