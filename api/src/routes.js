const router = require("express").Router();
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const logsRoutes = require("./routes/logsRoutes");
const activityRoutes = require("./routes/activityRoutes");
const alertController = require("./routes/alertRoutes");
const { authenticateToken } = require("./middlewares/authMiddleware");

router.get("/", async (req, res) => {
  try {
    return res.status(200).send("Express");
  } catch (error) {
    return res.status(500).send("Error to express");
  }
});

router.get("/protected-route", authenticateToken, (req, res) => {
  // This route is protected and requires a valid JWT
  res.status(200).json({ message: "This is a protected route" });
});

router.use("/users", userRoutes);
router.use("/validation-profiles", profileRoutes);
router.use("/validation-logs", logsRoutes);
router.use("/activity", activityRoutes);
router.use("/alert-subsription", alertController);

module.exports = router;
