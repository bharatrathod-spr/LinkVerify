const { getAllLogs, saveLog } = require("../services/logsService");
const { logActivity } = require("../utils/commonUtils");

// Get all logs

const getLogs = async (req, res) => {
  try {
    const { UserId } = req.user;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    const logs = await getAllLogs({ UserId, IsDelete: false }, date);

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create log
const createLog = async (data) => {
  try {
    const log = await saveLog(data);

    // Log the activity
    await logActivity(
      data.UserId,
      "CREATE",
      "Log",
      log.ValidationLogId,
      "POST",
      {
        NewData: log,
      },
      "cronjob"
    );

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = {
  getLogs,
  createLog,
};
