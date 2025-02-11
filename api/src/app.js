const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");

// Server App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

// Crons Jobs
require("./cron/validationJob");  

module.exports = app;
