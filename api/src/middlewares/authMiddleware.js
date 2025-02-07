const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Access denied" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user; // Attach user info to request
    next();
  });
};

module.exports = { authenticateToken };
