const {
  validateFields,
  stringRules,
  urlRules,
  cronExpressionRules,
} = require("../utils/validatorUtils");

const validateCreateProfile = validateFields([
  ...urlRules("SourceLink"),
  ...stringRules("SearchLink"),
  ...cronExpressionRules(),
  ...stringRules("Description", { required: false, maxLength: 500 }),
]);

const validateUpdateProfile = validateFields([
  ...urlRules("SourceLink", false),
  ...stringRules("SearchLink", { required: false }),
  ...stringRules("Description", { required: false, maxLength: 500 }),
]);

module.exports = {
  validateCreateProfile,
  validateUpdateProfile,
};
