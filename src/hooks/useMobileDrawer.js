import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

const useMobileDrawer = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  return { mobileOpen, toggleDrawer, isMobile };
};

export default useMobileDrawer;
