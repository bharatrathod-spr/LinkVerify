const MailConfiguration = require("../models/mailConfigModel");

const createMailConfiguration = async (req, res) => {
  try {
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

const getMailConfigurationDetails = async (req, res) => {
  const { MailConfigurationId } = req.params;
  try {
    const result = await MailConfiguration.findOne({
      MailConfigurationId,
      IsDelete: false,
    });

    if (!result) {
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

const updateMailConfiguration = async (req, res) => {
  const { MailConfigurationId } = req.params;
  const updateData = req.body;

  try {
    const result = await MailConfiguration.findOneAndUpdate(
      { MailConfigurationId, IsDelete: false },
      updateData,
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

const deleteMailConfiguration = async (MailConfigurationId) => {
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
  getMailConfigurationDetails,
  updateMailConfiguration,
  deleteMailConfiguration,
};
