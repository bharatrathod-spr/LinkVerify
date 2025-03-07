import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { UserForm } from "../../config/Forms/Forms";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../Common/Loader";

const UserModal = ({ open, onClose, user }) => {
  const { loading, handleUserUpdate, adduser } = useAuth();

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      maxWidth="md"
      fullWidth
      aria-labelledby="user-modal-title"
      aria-describedby="user-modal-description"
    >
      {loading && !user ? (
        <Loader />
      ) : (
        <DialogContent>
          <DialogTitle id="user-modal-title" sx={{ px: 0, pt: 0, color:"primary.main" }} variant="h6">
            {user.UserId ? "Update User Details" : "Add User Details"}
          </DialogTitle>
          
          <UserForm
            initialValues={user}
            onClose={onClose}
            id={user?.UserId}
            handleSubmit={(values) => {
              if (user?.UserId) {
                handleUserUpdate(user.UserId, values).then(() => {
                  onClose();
                });
              } else {
                adduser(values).then(() => {
                  onClose();
                });
              }
            }}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default UserModal;
