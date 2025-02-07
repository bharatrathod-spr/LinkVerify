import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import TableLayout from "../../components/Table/TableLayout";
import Loader from "../../components/Common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { MoreVert } from "@mui/icons-material";
import Swal from "sweetalert2";
import moment from "moment";
import UserModal from "../../components/Modals/UserModal";

const headerData = [
  { field: "Name", label: "Name", width: "20%" },
  { field: "EmailAddress", label: "E-mail", width: "20%" },
  { field: "PhoneNumber", label: "Phone Number", width: "15%" },
  { field: "IsActive", label: "Is Active", width: "10%" },
  { field: "CreatedBy", label: "Created By", width: "10%" },
  { field: "createdAt", label: "Created At", width: "15%" },
  { field: "actions", label: "Action", width: "10%" },
];

const mobileHeaderData = [
  { field: "Name", label: "Name", width: "30%" },
  { field: "EmailAddress", label: "E-mail", width: "30%" },
  { field: "createdAt", label: "Created At", width: "30%" },
  { field: "actions", label: "Action", width: "10%" },
];

const UsersTable = () => {
  const { loading, getUsers, users, handleDelete, handleUserUpdate } =
    useAuth();

  useEffect(() => {
    if (!users || !users.length) {
      getUsers();
    }
  }, [users]);

  const [open, setOpen] = useState(false);
  const [userSelect, setUserSelect] = useState(null);

  const toggleModel = () => {
    if (open) setUserSelect(null);
    setOpen(!open);
  };

  const [menuState, setMenuState] = useState({
    anchorEl: null,
    selectedUser: null,
  });

  const handleOpenMenu = (event, user) => {
    setMenuState({
      anchorEl: event.currentTarget,
      selectedUser: user,
    });
  };

  const handleCloseMenu = () => {
    setMenuState({
      anchorEl: null,
      selectedUser: null,
    });
  };

  // Update user status api with swal
  const updateStatus = async (user) => {
    const currentStatus = user.IsActive === "Active" ? "In Active" : "Active";
    let reason = "";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Please provide a reason to ${currentStatus} this user.`,
      input: "text",
      inputAttributes: {
        placeholder: `Enter reason to ${currentStatus}`,
        id: "update-reason",
      },
      inputValidator: (value) => {
        if (!value.trim()) {
          return `Reason for ${currentStatus} is required.`;
        }
      },
      showCancelButton: true,
      confirmButtonText: currentStatus === "In Active" ? "In Active" : "Active",
      confirmButtonColor: currentStatus === "In Active" ? "#d33" : "#3085d6",
      cancelButtonText: "Cancel",
      preConfirm: (inputValue) => {
        reason = inputValue.trim();
      },
    });

    if (result.isConfirmed) {
      handleUserUpdate(user.UserId, {
        IsActive: !(user.IsActive === "Active"),
        reason,
      });
    }
  };

  const deleteUsers = async (user) => {
    let reason = "";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      input: "text",
      inputAttributes: {
        placeholder: "Enter reason for deletion",
        id: "delete-reason",
      },
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Reason for deletion is required.";
        }
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancel",
      preConfirm: (inputValue) => {
        reason = inputValue.trim();
      },
      dangerMode: true,
    });

    if (result.isConfirmed) {
      handleDelete(user.UserId);
    }
  };

  // Render Action Buttons
  const renderActions = (user) => (
    <Box>
      <IconButton
        color="primary"
        onClick={(event) => handleOpenMenu(event, user)}
      >
        <MoreVert sx={{ color: "#333" }} />
      </IconButton>
      <Menu
        anchorEl={menuState.anchorEl}
        open={
          menuState.anchorEl !== null &&
          menuState.selectedUser?.UserId === user.UserId
        }
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            updateStatus(user);
            handleCloseMenu();
          }}
        >
          Update Status
        </MenuItem>
        <MenuItem
          onClick={() => {
            setUserSelect(user);
            toggleModel();
            handleCloseMenu();
          }}
        >
          Update User
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteUsers(user);
            handleCloseMenu();
          }}
        >
          Delete User
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Users
        </Typography>
        <Button variant="contained" color="primary" onClick={toggleModel}>
          Add User
        </Button>
      </Box>

      {loading && !users ? (
        <Loader />
      ) : (
        <Paper
          elevation={3}
          sx={{ padding: 2, marginTop: 2, position: "relative" }}
        >
          <TableLayout
            headerData={headerData}
            allData={users?.map((item) => ({
              ...item,
              actions: renderActions(item),
              createdAt: item.createdAt
                ? moment(new Date(item.createdAt)).format("YYYY-MM-DD HH:mm:ss")
                : "",
            }))}
            sortingList={[
              "Name",
              "EmailAddress",
              "PhoneNumber",
              "CreatedBy",
              "createdAt",
            ]}
            defaultSortOn="createdAt"
            dropdownSearchFields={["IsActive"]}
            dateFilterField=""
            mobileHeaderData={mobileHeaderData}
            collapseFields={headerData.map((header) => header.field)}
          />
        </Paper>
      )}

      {open && (
        <UserModal
          open={open}
          onClose={toggleModel}
          user={{
            FirstName: userSelect?.FirstName || "",
            LastName: userSelect?.LastName || "",
            PhoneNumber: userSelect?.PhoneNumber || "",
            EmailAddress: userSelect?.EmailAddress || "",
            UserId: userSelect?.UserId || "",
          }}
        />
      )}
    </Box>
  );
};

export default UsersTable;
