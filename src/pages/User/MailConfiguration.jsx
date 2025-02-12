// //MailConfiguration.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import MailConfigModal from "./MailConfigModal";
// import useMailConfig from "../../hooks/useMail";
// import { toast } from "react-toastify";
// import { useAuth } from "../../hooks/useAuth";

// const MailConfiguration = () => {
//   const { mailConfigList, handleDeleteMailConfig, handleFetchMailConfigById } =
//     useMailConfig();
//   const { user } = useAuth();
//   const userId = user.UserId;

//   const [open, setOpen] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [selectedConfigId, setSelectedConfigId] = useState(null);
//   const [editConfigId, setEditConfigId] = useState(null);

//   const handleAddClick = () => {
//     setOpen(true);
//     setEditConfigId(null); // Ensure new config, not edit
//   };

//   const handleEditClick = (config) => {
//     setEditConfigId(config.MailConfigurationId);
//     handleFetchMailConfigById(config.MailConfigurationId);
//     setOpen(true);
//   };

//   const handleDeleteClick = (configId) => {
//     setSelectedConfigId(configId);
//     setOpenDeleteDialog(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       await handleDeleteMailConfig(selectedConfigId);
//       toast.success("Mail configuration deleted successfully!");
//       setOpenDeleteDialog(false);
//     } catch (error) {
//       toast.error("Failed to delete mail configuration.");
//     }
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setEditConfigId(null);
//   };

//   return (
//     <Box sx={{ margin: "30px", mt: 5 }}>
//       <Typography variant="h5">Mail Configurations</Typography>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleAddClick}
//         sx={{ float: "right", mb: 5 }}
//       >
//         Add New Mail Configuration
//       </Button>

//       <TableContainer component={Paper} sx={{ mt: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Host</TableCell>
//               <TableCell>Port</TableCell>
//               <TableCell>Secure</TableCell>
//               <TableCell>User</TableCell>
//               <TableCell>Mail</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {mailConfigList.length > 0 ? (
//               mailConfigList.map((config) => (
//                 <TableRow key={config.MailConfigurationId}>
//                   <TableCell>{config.Host}</TableCell>
//                   <TableCell>{config.Port}</TableCell>
//                   <TableCell>{config.Secure ? "Yes" : "No"}</TableCell>
//                   <TableCell>{config.User}</TableCell>
//                   <TableCell>{config.Mail}</TableCell>
//                   <TableCell>
//                     <Button onClick={() => handleEditClick(config)}>
//                       Edit
//                     </Button>
//                     <Button
//                       onClick={() =>
//                         handleDeleteClick(config.MailConfigurationId)
//                       }
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   No mail configurations found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog
//         open={openDeleteDialog}
//         onClose={handleCloseDeleteDialog}
//         aria-labelledby="delete-dialog-title"
//         aria-describedby="delete-dialog-description"
//       >
//         <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <Typography id="delete-dialog-description">
//             Are you sure you want to delete this mail configuration?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeleteDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirmDelete} color="secondary">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <MailConfigModal
//         open={open}
//         handleClose={handleClose}
//         userId={userId}
//         configId={editConfigId}
//       />
//     </Box>
//   );
// };

// export default MailConfiguration;

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
} from "@mui/material";
import MailConfigModal from "./MailConfigModal";
import useMailConfig from "../../hooks/useMail";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const MailConfiguration = () => {
  const { mailConfigList, handleDeleteMailConfig, handleFetchMailConfigById } =
    useMailConfig();
  const { user } = useAuth();
  const userId = user.UserId;

  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [editConfigId, setEditConfigId] = useState(null);

  const handleAddClick = () => {
    setOpen(true);
    setEditConfigId(null);
  };

  const handleEditClick = (config) => {
    setEditConfigId(config.MailConfigurationId);
    handleFetchMailConfigById(config.MailConfigurationId);
    setOpen(true);
  };

  const handleDeleteClick = (configId) => {
    setSelectedConfigId(configId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteMailConfig(selectedConfigId);
      toast.success("Mail configuration deleted successfully!");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete mail configuration.");
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClose = () => {
    setOpen(false);
    setEditConfigId(null);
  };

  return (
    <Box sx={{ margin: "30px", mt: 5 }}>
      <Typography variant="h5">Mail Configurations</Typography>
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
            {mailConfigList.length > 0 ? (
              mailConfigList.map((config) => (
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
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete this mail configuration?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <MailConfigModal
        open={open}
        handleClose={handleClose}
        userId={userId}
        configId={editConfigId}
      />
    </Box>
  );
};

export default MailConfiguration;
