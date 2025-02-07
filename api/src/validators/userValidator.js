const { body } = require("express-validator");
const {
  validateFields,
  stringRules,
  emailRules,
  passwordRules,
  phoneRules,
  enumRules,
} = require("../utils/validatorUtils");

const validateCreateUser = validateFields([
  ...stringRules("FirstName"),
  ...stringRules("LastName"),
  ...emailRules(),
  ...passwordRules("Password", false),
  ...enumRules("Role", ["user", "super_user"]),
  ...phoneRules(),
  ...enumRules("CreatedBy", ["user", "super_user"]),
]);

const validateUpdateUser = validateFields([
  ...stringRules("FirstName", { required: false }),
  ...stringRules("LastName", { required: false }),
  ...emailRules("EmailAddress", false),
  ...passwordRules("Password", false),
  ...phoneRules(),
]);

const validateUpdateUserProfile = validateFields([
  ...stringRules("FirstName", { required: false }),
  ...stringRules("LastName", { required: false }),
  ...emailRules("EmailAddress", false),
  ...passwordRules("Password", false),
  ...phoneRules(),
  body("UserDetails")
    .optional()
    .isObject()
    .withMessage("UserDetails must be an object"),
]);

const validateUpdatePassword = validateFields([
  ...passwordRules("Password"),
  ...passwordRules("newPassword"),
]);

const validateLogin = validateFields([
  ...emailRules(),
  ...passwordRules("Password"),
]);

const validateForgotPassword = validateFields([...emailRules()]);

const validateResetPassword = validateFields([
  ...passwordRules(),
  ...stringRules("Token"),
]);

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateUserProfile,
  validateUpdatePassword,
};
