const Logs = require("../models/logsModel");

const getAllLogs = async (filter, date) => {
  const timezoneOffset = new Date().getTimezoneOffset();

  const localDate = new Date(date);
  const startOfDay = new Date(localDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(localDate.setHours(23, 59, 59, 999));

  startOfDay.setMinutes(startOfDay.getMinutes() - timezoneOffset);
  endOfDay.setMinutes(endOfDay.getMinutes() - timezoneOffset);

  const dateFilter = {
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  };

  return await Logs.aggregate([
    {
      $match: { ...filter, ...dateFilter },
    },
    {
      $lookup: {
        from: "validation-profiles",
        let: {
          validationProfileId: "$ValidationProfileId",
          logCreatedAt: "$createdAt",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$ValidationProfileId", "$$validationProfileId"] },
                  { $eq: ["$IsDelete", false] },
                  {
                    $gte: ["$$logCreatedAt", startOfDay],
                  },
                  {
                    $lte: ["$$logCreatedAt", endOfDay],
                  },
                ],
              },
            },
          },
        ],
        as: "validationProfileData",
      },
    },
    {
      $unwind: {
        path: "$validationProfileData",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        _id: "$ValidationLogId",
        Follow: {
          $cond: {
            if: { $eq: ["$MetaRobotsTags.Follow", true] },
            then: "Follow",
            else: "No Follow",
          },
        },
        Index: {
          $cond: {
            if: { $eq: ["$MetaRobotsTags.Index", true] },
            then: "Index",
            else: "No Index",
          },
        },
        IsSuccess: {
          $cond: {
            if: { $eq: ["$IsSuccess", true] },
            then: "Success",
            else: "Failure",
          },
        },
        createdAt: 1,
        FailureReasons: 1,
        SourceLink: "$validationProfileData.SourceLink",
        SearchLink: "$validationProfileData.SearchLink",
      },
    },
  ]);
};

// Get dashboard logs data
const filterLogs = async (filter) => {
  return await Logs.aggregate(filter);
};

// Save new log
const saveLog = async (logData) => {
  const log = new Logs(logData);
  return await log.save();
};

module.exports = {
  getAllLogs,
  filterLogs,
  saveLog,
};
