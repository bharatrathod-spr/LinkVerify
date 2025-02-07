const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { PORT } = require("./config/env");

// Connect to Database
connectDB();

// Create server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
