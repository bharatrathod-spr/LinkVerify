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
        paddingLeft: isMobile ? "30px" : "240px",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
          Welcome to LinkVerify
        </Typography>

        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsRounded />
          </Badge>
        </IconButton>

        <IconButton color="inherit" onClick={handleOpenMenu}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "#ffffff",
              color: "#6e8efb",
              fontWeight: "bold",
            }}
          >
            {user?.FirstName?.charAt(0).toUpperCase()}
            {user?.LastName?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <StyledMenu
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
              key="settings"
              component={Link}
              to="/user/settings"
              onClick={handleCloseMenu}
            >
              <SettingsRounded sx={{ marginRight: 1 }} /> Settings
            </MenuItem>,
          ]}
          <MenuItem onClick={logout}>
            <LogoutRounded sx={{ marginRight: 1, color: "red" }} /> Logout
          </MenuItem>
        </StyledMenu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
