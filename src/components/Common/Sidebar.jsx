import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import routes from "../../helpers/routes";
import useMobileDrawer from "../../hooks/useMobileDrawer";
import "./Sidebar.css";
import logo from "../../assets/svg/logo.png";

import { SettingsRounded, MenuRounded } from "../../helpers/icons";

const Sidebar = ({ role }) => {
  const { mobileOpen, toggleDrawer, isMobile } = useMobileDrawer();
  const location = useLocation();

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
        <Link to="/user" style={{ display: "flex", alignItems: "center" }}>
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

      <Box className="sidebar-footer">
        <ListItemButton className="sidebar-footer-button">
          <Box display="flex" alignItems="center">
            <Box component="span" className="icon-container">
              <SettingsRounded />
            </Box>
            <ListItemText primary="Settings" />
          </Box>
        </ListItemButton>
      </Box>
    </>
  );

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
        anchor="left"
        className="sidebar-drawer"
      >
        <DrawerContent />
      </Drawer>
    </>
  );
};

export default Sidebar;
