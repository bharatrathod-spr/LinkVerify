import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../Common/Sidebar";
import Navbar from "../Common/Navbar";
import useMobileDrawer from "../../hooks/useMobileDrawer";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../Common/Loader";

const User = () => {
  const { loading, token, error, user } = useAuth();
  const { isMobile } = useMobileDrawer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (token && error)) {
      navigate("/auth/login");
    }
  }, [token, error]);

  const userRole = user?.Role || "guest";

  if (loading && !user) {
    return <Loader />;
  }

  return (
    <Box className="user-container">
      <Sidebar role={userRole} />

      <Navbar role={userRole} />

      <Box
        component="main"
        className="user-main"
        style={{
          paddingRight: isMobile ? "0px" : "240px",
        }}
      >
        <Outlet />
      </Box>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default User;
