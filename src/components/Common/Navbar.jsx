import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  AccountCircleRounded,
  LogoutRounded,
  LockRounded,
  DashboardRounded,
  MailRounded,
  Notifications,
  MenuRounded,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import routes from "../../helpers/routes";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/svg/logo.svg";

const StyledAppBar = styled(AppBar)({
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const Navbar = ({ role }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  const sidebarLinks =
    routes.find((route) => route.layout === `/${role}`)?.pages || [];

  const activeRoute = location.pathname;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          to="/user/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            backgroundColor: "white",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: 40, height: 40, marginRight: 8 }}
          />
          <Typography variant="h6" fontWeight="bold" color="primary">
            LinkVerify
          </Typography>
        </Link>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {sidebarLinks
            .filter((link) => link.isDisplay)
            .map((link) => (
              <Link
                key={link.path}
                to={`/${role}/${link.path || ""}`}
                style={{
                  textDecoration: "none",
                  color:
                    activeRoute === `/${role}/${link.path}`
                      ? "white"
                      : "inherit",
                  fontWeight:
                    activeRoute === `/${role}/${link.path}` ? "bold" : "normal",
                  position: "relative",
                }}
              >
                {link.title}

                {activeRoute === `/${role}/${link.path}` && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderBottom: "5px solid white",
                    }}
                  />
                )}
              </Link>
            ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit" onClick={handleOpenMenu}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#ffffff",
                color: "#5951da",
                fontWeight: "bold",
                marginRight: 1,
              }}
            >
              {user?.FirstName?.charAt(0).toUpperCase()}
              {user?.LastName?.charAt(0).toUpperCase()}
            </Avatar>

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {user?.FirstName} {user?.LastName}
              </Typography>
              {/* <Typography
                variant="body2"
                sx={{ fontWeight: "normal", color: "White" }}
              >
                {user?.Role}
              </Typography> */}
            </Box>
          </IconButton>

          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{ display: { md: "none", color: "primary.main" } }}
          >
            <MenuRounded />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {role !== "super_user" && (
            <>
              <MenuItem
                component={Link}
                to="/user/profile"
                onClick={handleCloseMenu}
                style={{
                  fontWeight:
                    activeRoute === "/user/profile" ? "bold" : "normal",
                  color:
                    activeRoute === "/user/profile" ? "#5951da" : "inherit",
                }}
              >
                <AccountCircleRounded sx={{ marginRight: 1 }} /> Profile
              </MenuItem>
              <MenuItem
                component={Link}
                to="/user/changepassword"
                onClick={handleCloseMenu}
                style={{
                  fontWeight:
                    activeRoute === "/user/changepassword" ? "bold" : "normal",
                  color:
                    activeRoute === "/user/changepassword"
                      ? "#5951da"
                      : "inherit",
                }}
              >
                <LockRounded sx={{ marginRight: 1 }} /> Change Password
              </MenuItem>
              <MenuItem
                component={Link}
                to="/user/activities"
                onClick={handleCloseMenu}
                style={{
                  fontWeight:
                    activeRoute === "/user/activities" ? "bold" : "normal",
                  color:
                    activeRoute === "/user/activities" ? "#5951da" : "inherit",
                }}
              >
                <DashboardRounded sx={{ marginRight: 1 }} /> My Activities
              </MenuItem>
              <MenuItem
                component={Link}
                to="/user/AlertSubscriptions"
                onClick={handleCloseMenu}
                style={{
                  fontWeight:
                    activeRoute === "/user/AlertSubscriptions"
                      ? "bold"
                      : "normal",
                  color:
                    activeRoute === "/user/AlertSubscriptions"
                      ? "#5951da"
                      : "inherit",
                }}
              >
                <Notifications sx={{ marginRight: 1 }} /> Alert Subscriptions
              </MenuItem>
            </>
          )}

          <MenuItem onClick={logout}>
            <LogoutRounded sx={{ marginRight: 1, color: "red" }} /> Logout
          </MenuItem>
        </Menu>

        {mobileMenuOpen && (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              right: 0,
              width: "100%",
              backgroundColor: "#5951da",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              padding: 2,
              display: { md: "none" },
              zIndex: 10,
            }}
          >
            {sidebarLinks
              .filter((link) => link.isDisplay)
              .map((link) => (
                <ListItemButton
                  key={link.path}
                  component={Link}
                  to={`/${role}/${link.path || ""}`}
                  sx={{
                    padding: "10px 15px",
                    borderBottom: "1px solid #ddd",
                    color:
                      activeRoute === `/${role}/${link.path}`
                        ? "main"
                        : "inherit",
                    fontWeight:
                      activeRoute === `/${role}/${link.path}`
                        ? "bold"
                        : "normal",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary={link.title} />
                </ListItemButton>
              ))}
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
