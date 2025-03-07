import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import routes from "../../helpers/routes";
import useMobileDrawer from "../../hooks/useMobileDrawer";
import "./Sidebar.css";
import logo from "../../assets/svg/logo.svg";
import {
  NotificationsRounded,
  AccountCircleRounded,
  LogoutRounded,
  LockRounded,
  DashboardRounded,
  MailRounded,
  Notifications,
  Settings,
} from "@mui/icons-material";

import { SettingsRounded, MenuRounded } from "../../helpers/icons";
import { useAuth } from "../../hooks/useAuth";
import { styled } from "@mui/system";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    minWidth: 200,
    padding: "10px 0",
    position: "absolute",
    bottom: 20,
    right: 0,
    margin: "16px",
    width: "180px",
    height: "220px",
    opacity: 0,
    transform: "translateX(100%)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  },
  "&.open .MuiPaper-root": {
    opacity: 1,
    transform: "translateX(0)",
  },
}));

const Sidebar = ({ role }) => {
  const { mobileOpen, toggleDrawer, isMobile } = useMobileDrawer();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const sidebarLinks =
    routes.find((route) => route.layout === `/${role}`)?.pages || [];

  const activeRoute = location.pathname;

  const DrawerContent = () => (
    <>
      <Box
        className="sidebar-header"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        padding={2}
      >
        <Link
          to="/user/dashboard"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img src={logo} alt="Logo" style={{ width: 40, height: 40 }} />
          <Typography variant="h6" align="center">
            LinkVerify
          </Typography>
        </Link>
      </Box>
      <List className="sidebar-list">
        {sidebarLinks
          .filter((link) => link.isDisplay)
          .map((link, index) => (
            <ListItemButton
              key={link.path}
              id={`list-${index}`}
              component={Link}
              to={`/${role}/${link.path || ""}`}
              className={`sidebar-link ${
                activeRoute === `/${role}/${link.path}` ? "active" : ""
              }`}
              onClick={() => {
                if (isMobile) toggleDrawer();
              }}
            >
              {link.icon && (
                <Box component="span" className="icon-container">
                  <link.icon />
                </Box>
              )}
              <ListItemText primary={link.title} />
            </ListItemButton>
          ))}
      </List>
    </>
  );

  const handleOpenMenu = (event) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  return (
    <>
      {isMobile && (
        <IconButton
          aria-label="toggle drawer"
          onClick={toggleDrawer}
          className="menu-icon-button"
        >
          <MenuRounded />
        </IconButton>
      )}

      <Drawer
        open={mobileOpen}
        onClose={toggleDrawer}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="right"
        className="sidebar-drawer"
      >
        <DrawerContent />
        <Box
          sx={{
            position: "relative",
            marginTop: 2,
            backgroundColor: "#5951da",
          }}
        >
          <IconButton
            color="inherit"
            onClick={handleOpenMenu}
            sx={{ display: "flex", alignItems: "center", marginLeft: "15px" }}
          >
            <Settings sx={{ marginRight: 1, color: "#fff" }} />{" "}
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#fff", fontSize: "20px" }}
            >
              Settings
            </Typography>
          </IconButton>

          <StyledMenu
            className={menuOpen ? "open" : ""}
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
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
              // <MenuItem
              //   key="mail-configuration"
              //   component={Link}
              //   to="/user/mail-configuration"
              //   onClick={handleCloseMenu}
              // >
              //   <MailRounded sx={{ marginRight: 1 }} /> Mail Configuration
              // </MenuItem>,
            ]}
            <MenuItem onClick={logout}>
              <LogoutRounded sx={{ marginRight: 1, color: "red" }} /> Logout
            </MenuItem>
          </StyledMenu>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
