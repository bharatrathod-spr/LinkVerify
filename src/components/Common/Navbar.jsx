import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
  Badge,
} from "@mui/material";
import { styled } from "@mui/system";

import {
  SettingsRounded,
  NotificationsRounded,
  AccountCircleRounded,
  LogoutRounded,
  LockRounded,
  DashboardRounded,
  MailRounded,
  Notifications,
} from "@mui/icons-material";

import useMobileDrawer from "../../hooks/useMobileDrawer";
import { useAuth } from "../../hooks/useAuth";

const StyledAppBar = styled(AppBar)({
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    borderRadius: 10,
    minWidth: 200,
    padding: "10px 0",
  },
});

const Navbar = ({ role }) => {
  const { isMobile } = useMobileDrawer();
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, user } = useAuth();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar
      position="fixed"
      sx={{
        paddingRight: isMobile ? "30px" : "240px",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
          Welcome to LinkVerify
        </Typography>

        <IconButton
          color="inherit"
          onClick={handleOpenMenu}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "#ffffff",
              color: "#6e8efb",
              fontWeight: "bold",
              marginRight: 1,
            }}
          >
            {user?.FirstName?.charAt(0).toUpperCase()}
            {user?.LastName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {user?.FirstName} {user?.LastName}
            </Typography>
          </Box>
        </IconButton>

        {/* <StyledMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {role === "user" && [
            <MenuItem
              key="profile"
              component={Link}
              to="/user/profile"
              onClick={handleCloseMenu}
            >
              <AccountCircleRounded sx={{ marginRight: 1 }} /> Profile
            </MenuItem>,
            <MenuItem
              key="changepassword"
              component={Link}
              to="/user/changepassword"
              onClick={handleCloseMenu}
            >
              <LockRounded sx={{ marginRight: 1 }} /> Change Password
            </MenuItem>,
            <MenuItem
              key="activities"
              component={Link}
              to="/user/activities"
              onClick={handleCloseMenu}
            >
              <DashboardRounded sx={{ marginRight: 1 }} /> My Activities
            </MenuItem>,
            <MenuItem
              key="AlertSubscriptions"
              component={Link}
              to="/user/AlertSubscriptions"
              onClick={handleCloseMenu}
            >
              <Notifications sx={{ marginRight: 1 }} /> Alert Subscriptions
            </MenuItem>,
            <MenuItem
              key="mail-configuration"
              component={Link}
              to="/user/mail-configuration"
              onClick={handleCloseMenu}
            >
              <MailRounded sx={{ marginRight: 1 }} /> Mail Configuration
            </MenuItem>,
          ]}
          <MenuItem onClick={logout}>
            <LogoutRounded sx={{ marginRight: 1, color: "red" }} /> Logout
          </MenuItem>
        </StyledMenu> */}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
