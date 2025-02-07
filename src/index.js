import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./store/store";
import ThemeProvider from "./config/Theme/ThemeProvider";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Router>
    </Provider>
  </HelmetProvider>
);
