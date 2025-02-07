// utils/validatorUtils.js
const { body, validationResult } = require("express-validator");

// Generic field validator builder
const validateFields = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
      next();
    },
  ];
};

// String field validation
const stringRules = (fieldName, options = {}) => {
  const { required = true, maxLength } = options;
  const rules = [];
  if (required) {
    rules.unshift(
      body(fieldName).isString().withMessage(`${fieldName} must be a string`)
    );
    rules.unshift(
      body(fieldName).notEmpty().withMessage(`${fieldName} is required`)
    );
  }

  if (maxLength) {
    rules.push(
      body(fieldName)
        .isLength({ max: maxLength })
        .withMessage(`${fieldName} must not exceed ${maxLength} characters`)
    );
  }
  return rules;
};

// URL validation rules
const urlRules = (fieldName, required = true) => [
  body(fieldName)
    .if(() => required)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isURL({ require_protocol: true })
    .withMessage(`${fieldName} must be a valid URL`),
];

// Email validation rules
const emailRules = (fieldName = "EmailAddress", required = true) => [
  body(fieldName)
    .if(() => required)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isEmail()
    .withMessage(`Invalid email format`)
    .normalizeEmail(),
];

// Password validation rules
const passwordRules = (fieldName = "Password", required = true) => [
  body(fieldName)
    .if(() => required)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isLength({ min: 12 })
    .withMessage(`${fieldName} must be at least 12 characters long`)
    .matches(/[A-Z]/)
    .withMessage(`${fieldName} must contain at least one uppercase letter`)
    .matches(/[a-z]/)
    .withMessage(`${fieldName} must contain at least one lowercase letter`)
    .matches(/\d/)
    .withMessage(`${fieldName} must contain at least one number`)
    .matches(/[!@#$%^&*]/)
    .withMessage(`${fieldName} must contain at least one special character`)
    .custom((value) => {
      const commonPasswords = [
        "password",
        "123456",
        "123456789",
        "qwerty",
        "abc123",
        "111111",
      ];
      if (commonPasswords.includes(value)) {
        throw new Error(`${fieldName} is too common`);
      }
      return true;
    }),
];

// Phone number validation rules
const phoneRules = (fieldName = "PhoneNumber") => [
  body(fieldName)
    .optional()
    .matches(/^((\(\d{3}\)\s?|\d{3}[-\s]?))\d{3}[-\s]?\d{4}$/)
    .withMessage(`${fieldName} must be a valid phone number`),
];

// Cron expression validation rules
const cronExpressionRules = (fieldName = "CronExpression") => [
  body(fieldName).notEmpty().withMessage(`${fieldName} is required`),
];

// Enum validation
const enumRules = (fieldName, allowedValues) => [
  body(fieldName)
    .optional()
    .isIn(allowedValues)
    .withMessage(
      `${fieldName} must be one of the following values: ${allowedValues.join(
        ", "
      )}`
    ),
];

// Boolean validation
const booleanRules = (fieldName) => [
  body(fieldName)
    .optional()
    .isBoolean()
    .withMessage(`${fieldName} must be a boolean`),
];

module.exports = {
  validateFields,
  stringRules,
  urlRules,
  emailRules,
  passwordRules,
  phoneRules,
  cronExpressionRules,
  enumRules,
  booleanRules,
};
