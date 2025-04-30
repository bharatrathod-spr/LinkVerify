import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
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
} from "@mui/material"
import {
  AccountCircleRounded,
  LogoutRounded,
  LockRounded,
  DashboardRounded,
  Notifications,
  MenuRounded,
} from "@mui/icons-material"
import { styled } from "@mui/system"
import routes from "../../helpers/routes"
import { useAuth } from "../../hooks/useAuth"
import logo from "../../assets/svg/logo2.svg"

const StyledAppBar = styled(AppBar)({
  boxShadow: "0px 4px 15px rgba(89, 81, 218, 0.15)",
  background: "linear-gradient(90deg, #5951da 0%, #7b74e2 100%)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
})

const Navbar = ({ role }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout, user } = useAuth()
  const location = useLocation()

  const sidebarLinks = routes.find((route) => route.layout === `/${role}`)?.pages || []

  const activeRoute = location.pathname

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <StyledAppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: { xs: "0.5rem 1rem", md: "0.5rem 2rem" },
          minHeight: "80px",
        }}
      >
        <Link
          to="/user/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "0px 5px",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <img src={logo || "/placeholder.svg"} alt="Logo" style={{ width: 200, height: 70, marginRight: 8 }} />
          {/* <Typography variant="h6" fontWeight="bold" color="primary">
            TrackBacklinks
          </Typography> */}
        </Link>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
            "& a": {
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transform: "translateY(-2px)",
              },
            },
          }}
        >
          {sidebarLinks
            .filter((link) => link.isDisplay)
            .map((link) => (
              <Link
                key={link.path}
                to={`/${role}/${link.path || ""}`}
                style={{
                  textDecoration: "none",
                  color: activeRoute === `/${role}/${link.path}` ? "white" : "inherit",
                  fontWeight: activeRoute === `/${role}/${link.path}` ? "bold" : "normal",
                  position: "relative",
                }}
              >
                {link.title}

                {activeRoute === `/${role}/${link.path}` && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)",
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
                width: 40,
                height: 40,
                bgcolor: "#ffffff",
                color: "#5951da",
                fontWeight: "bold",
                marginRight: 1,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                border: "2px solid rgba(255, 255, 255, 0.8)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
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
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: 200,
              borderRadius: "12px",
              mt: 1.5,
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
              "& .MuiMenuItem-root": {
                padding: "10px 16px",
                borderRadius: "6px",
                margin: "4px 8px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(89, 81, 218, 0.08)",
                },
              },
            },
          }}
        >
          <MenuItem
            component={Link}
            to="/user/profile"
            onClick={handleCloseMenu}
            style={{
              fontWeight: activeRoute === "/user/profile" ? "bold" : "normal",
              color: activeRoute === "/user/profile" ? "#5951da" : "inherit",
            }}
          >
            <AccountCircleRounded sx={{ marginRight: 1 }} /> Profile
          </MenuItem>
          <MenuItem
            component={Link}
            to="/user/changepassword"
            onClick={handleCloseMenu}
            style={{
              fontWeight: activeRoute === "/user/changepassword" ? "bold" : "normal",
              color: activeRoute === "/user/changepassword" ? "#5951da" : "inherit",
            }}
          >
            <LockRounded sx={{ marginRight: 1 }} /> Change Password
          </MenuItem>
          <MenuItem
            component={Link}
            to="/user/activities"
            onClick={handleCloseMenu}
            style={{
              fontWeight: activeRoute === "/user/activities" ? "bold" : "normal",
              color: activeRoute === "/user/activities" ? "#5951da" : "inherit",
            }}
          >
            <DashboardRounded sx={{ marginRight: 1 }} /> My Activities
          </MenuItem>
          <MenuItem
            component={Link}
            to="/user/AlertSubscriptions"
            onClick={handleCloseMenu}
            style={{
              fontWeight: activeRoute === "/user/AlertSubscriptions" ? "bold" : "normal",
              color: activeRoute === "/user/AlertSubscriptions" ? "#5951da" : "inherit",
            }}
          >
            <Notifications sx={{ marginRight: 1 }} /> Alert Subscriptions
          </MenuItem>
          {/* <MenuItem
            component={Link}
            to="/user/mail-configuration"
            onClick={handleCloseMenu}
            style={{
              fontWeight:
                activeRoute === "/user/mail-configuration" ? "bold" : "normal",
              color:
                activeRoute === "/user/mail-configuration"
                  ? "#5951da"
                  : "inherit",
            }}
          >
            <MailRounded sx={{ marginRight: 1 }} /> Mail Configuration
          </MenuItem> */}
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
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
              borderTop: "1px solid rgba(89, 81, 218, 0.1)",
              padding: 2,
              display: { md: "none" },
              zIndex: 10,
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
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
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    backgroundColor: activeRoute === `/${role}/${link.path}` ? "rgba(89, 81, 218, 0.1)" : "transparent",
                    color: activeRoute === `/${role}/${link.path}` ? "#5951da" : "#555",
                    fontWeight: activeRoute === `/${role}/${link.path}` ? "bold" : "normal",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(89, 81, 218, 0.05)",
                    },
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
  )
}

export default Navbar
