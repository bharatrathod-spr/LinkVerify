const MailConfiguration = require("../models/mailConfigModel");
const AlertSubscription = require("../models/alertModel");

const createMailConfiguration = async (req, res) => {
  try {
    const existingConfig = await MailConfiguration.findOne({
      User: req.body.User,
    });

    if (existingConfig) {
      return res.status(400).json({
        statusCode: 400,
        message: "Mail configuration already exists for this user.",
      });
    }

    const userToSave = await MailConfiguration.create(req.body);

    return res.status(201).json({
      statusCode: 201,
      data: userToSave,
      message: "Mail Details Posted Successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
};

const getMailConfiguration = async (req, res) => {
  const { MailConfigurationId } = req.params;
  try {
    const result = await MailConfiguration.find({
      MailConfigurationId,
      IsDelete: false,
    });

    if (!result || result.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: `No Mail Details found for MailConfigurationId: ${MailConfigurationId}`,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: `Mail Details fetched successfully`,
      result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
};

const getMailConfigurationDetails = async (req, res) => {
  const { UserId } = req.params;
  try {
    const result = await MailConfiguration.find({
      UserId,
      IsDelete: false,
    });

    if (!result || result.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: `No Mail Details found for UserId: ${UserId}`,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: `Mail Details fetched successfully`,
      result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
};

const getMailConfigurationByAlertSubscription = async (req, res) => {
  const { UserId } = req.user;
  try {
    const alertSubscription = await AlertSubscription.find({
      UserId,
    });

    if (!alertSubscription || alertSubscription.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: `No alert subscription found for UserId: ${UserId}`,
      });
    }

    const mailConfigIds = alertSubscription.map(
      (sub) => sub.MailConfigurationId
    );

    const mailConfigurations = await MailConfiguration.find({
      MailConfigurationId: { $in: mailConfigIds },
      IsDelete: false,
    });

    if (!mailConfigurations || mailConfigurations.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: `No mail configuration found for UserId: ${UserId}`,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: `Mail configurations fetched successfully`,
      result: mailConfigurations,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
};

const updateMailConfiguration = async (req, res) => {
  const { MailConfigurationId } = req.params;
  const { Host, Port, User, Password, Mail } = req.body;

  try {
    const existingConfig = await MailConfiguration.findOne({
      User,
      IsDelete: false,
    });

    if (
      existingConfig &&
      existingConfig.MailConfigurationId !== MailConfigurationId
    ) {
      return res.status(400).json({
        statusCode: 400,
        message: "A mail configuration already exists for this user.",
      });
    }

    const result = await MailConfiguration.findOneAndUpdate(
      { MailConfigurationId, IsDelete: false },
      { Host, Port, User, Password, Mail },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: "No Mail Details found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Mail Details updated successfully",
      result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong, please try later!",
    });
  }
};

const deleteMailConfiguration = async (req, res) => {
  const { MailConfigurationId } = req.params;
  const data = await MailConfiguration.findOneAndUpdate(
    { MailConfigurationId },
    { $set: { IsDelete: true } },
    { new: true }
  );

  if (!data) {
    return {
      statusCode: 404,
      message: `No Mail Details found for MailConfigurationId: ${MailConfigurationId}`,
    };
  }

  return {
    statusCode: 200,
    message: `Mail Details marked as deleted successfully`,
    deletedItem: data,
  };
};

module.exports = {
  createMailConfiguration,
  getMailConfiguration,
  getMailConfigurationDetails,
  updateMailConfiguration,
  deleteMailConfiguration,
  getMailConfigurationByAlertSubscription,
};
