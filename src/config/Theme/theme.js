import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5951da",
      light: "#0000ff20",
    },
    secondary: {
      main: "#ff4081",
      light: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "poppins",
    fontSize: 14,
    h1: {
      fontSize: "2.5rem",
    },
    h2: {
      fontSize: "2rem",
    },
    body1: {
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--mui-palette-primary-main": "#5951da",
          "--mui-palette-primary-light": "#0000ff20",
          "--mui-palette-secondary-main": "#ff4081",
          "--mui-palette-secondary-light": "#ffffff",
          "--mui-palette-text-primary": "#333333",
          "--mui-palette-text-secondary": "#666666",
        },
        "::-webkit-scrollbar": {
          width: "0",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 3px 3px 2px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  },
});

export default theme;
