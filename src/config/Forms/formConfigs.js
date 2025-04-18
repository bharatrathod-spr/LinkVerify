import {
  Email,
  Home,
  LocationCity,
  Lock,
  Person,
  Phone,
  Public,
} from "../../helpers/icons";
import * as Yup from "yup";

const passwordValidationSchema = Yup.string()
  .required("Password is required")
  .min(12, "Password must be at least 12 characters long")
  .matches(/[A-Z]/, `Password must contain at least one uppercase letter`)
  .matches(/[a-z]/, `Password must contain at least one lowercase letter`)
  .matches(/\d/, `Password must contain at least one number`)
  .matches(/[!@#$%^&*]/, `Password must contain at least one special character`)
  .notOneOf(
    [/1234/, /abcd/, /qwerty/, /password/, /\d{4}/, /[a-z]{4}/],
    'Avoid sequential or repeating patterns like "1234", "abcd", etc.'
  );

const login = {
  fields: [
    {
      name: "EmailAddress",
      label: "Email Address",
      type: "email",
      placeholder: "Enter Your Email Address",
      grid: 12,
      icon: Email,
    },
    {
      name: "Password",
      label: "Password",
      type: "password",
      placeholder: "Enter Your Password",
      grid: 12,
      icon: Lock,
    },
  ],
  validationSchema: Yup.object().shape({
    EmailAddress: Yup.string()
      .email("Invalid email")
      .required("Email Address is required"),
    Password: passwordValidationSchema,
  }),
  buttons: [
    {
      label: "Login",
      type: "submit",
      color: "primary",
      grid: 12,
    },
  ],
};

const signup = {
  fields: [
    {
      name: "FirstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      grid: 12,
      icon: Person,
    },
    {
      name: "LastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      grid: 12,
      icon: Person,
    },
    {
      name: "EmailAddress",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      grid: 12,
      icon: Email,
    },
    {
      name: "Password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      grid: 12,
      icon: Lock,
    },
    {
      name: "ConfirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Re-enter password",
      grid: 12,
      icon: Lock,
    },
  ],
  validationSchema: Yup.object().shape({
    FirstName: Yup.string().required("First name is required"),
    LastName: Yup.string().required("Last name is required"),
    EmailAddress: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    Password: passwordValidationSchema,
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref("Password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  }),
  buttons: [
    {
      label: "Sign Up",
      type: "submit",
      color: "primary",
      grid: 12,
    },
  ],
};

const userProfile = {
  fields: [
    {
      name: "FirstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter Your First Name",
      grid: 3,
      icon: Person,
    },
    {
      name: "LastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter Your Last Name",
      grid: 3,
      icon: Person,
    },
    {
      name: "UserDetails.Address",
      label: "Address",
      type: "text",
      placeholder: "Enter Your Address",
      grid: 6,
      icon: Home,
    },
    {
      name: "EmailAddress",
      label: "Email",
      type: "email",
      placeholder: "Enter Your Email",
      grid: 3,
      icon: Email,
    },
    {
      name: "PhoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "Enter Your Phone Number",
      grid: 3,
      icon: Phone,
    },
    {
      name: "UserDetails.City",
      label: "City",
      type: "text",
      placeholder: "Enter Your City",
      grid: 3,
      icon: LocationCity,
    },
    {
      name: "UserDetails.State",
      label: "State",
      type: "text",
      placeholder: "Enter Your State",
      grid: 3,
      icon: LocationCity,
    },
    {
      name: "UserDetails.AlternativeEmailAddress",
      label: "Alternative Email",
      type: "email",
      placeholder: "Enter Alternative Email",
      grid: 3,
      icon: Email,
    },
    {
      name: "UserDetails.AlternativePhoneNumber",
      label: "Alternative Phone Number",
      type: "text",
      placeholder: "Enter Alternative Phone Number",
      grid: 3,
      icon: Phone,
    },
    {
      name: "UserDetails.Country",
      label: "Country",
      type: "text",
      placeholder: "Enter Your Country",
      grid: 3,
      icon: Public,
    },
    {
      name: "UserDetails.PostalCode",
      label: "PostalCode",
      type: "text",
      placeholder: "Enter Your Postal Code",
      grid: 3,
      icon: Home,
    },
  ],
  validationSchema: Yup.object({
    FirstName: Yup.string().required("First name is required"),
    LastName: Yup.string().required("Last name is required"),
    EmailAddress: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    PhoneNumber: Yup.string().matches(
      /^\d{10}$/,
      "Phone number must be 10 digits"
    ),
    UserDetails: Yup.object({
      AlternativeEmailAddress: Yup.string().email("Invalid email"),
      AlternativePhoneNumber: Yup.string().matches(
        /^\d{10}$/,
        "Phone number must be 10 digits"
      ),
      Address: Yup.string(),
      City: Yup.string(),
      State: Yup.string(),
      Country: Yup.string(),
      PostalCode: Yup.string(),
    }),
  }),
  buttons: [
    {
      label: "Update",
      type: "submit",
      color: "primary",
      grid: 1,
    },
    {
      label: "Back",
      type: "button",
      color: "primary",
      variant: "outlined",
      grid: 1,
    },
  ],
};

const profile = {
  fields: [
    {
      name: "Description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Description For Profile",
      grid: 12,
    },
    {
      name: "SourceLink",
      label: "Source Link",
      type: "text",
      placeholder: "Enter Your Source Link",
      grid: 6,
    },
    {
      name: "SearchLink",
      label: "Search Link",
      type: "text",
      placeholder: "Enter Your Search Link",
      grid: 6,
    },
    {
      name: "cronExpression.occurrence",
      label: "Frequency",
      type: "number",
      placeholder: "Enter Frequency",
      grid: 6,
    },
    {
      name: "cronExpression.period",
      label: "Duration",
      type: "select",
      placeholder: "Select a Duration",
      grid: 6,
      options: [
        { value: "minutes", label: "Minutes" },
        { value: "hours", label: "Hours" },
        { value: "days", label: "Days" },
        { value: "weeks", label: "Weeks" },
        { value: "months", label: "Months" },
      ],
    },
  ],
  validationSchema: Yup.object().shape({
    SourceLink: Yup.string()
      .url("Invalid Link")
      .required("Source Link is required"),
    SearchLink: Yup.string().required("Search Link is required"),
    Description: Yup.string().required("Description is required"),
    cronExpression: Yup.object().shape({
      occurrence: Yup.number()
        .required("Frequency is required")
        .positive("Must be a positive number")
        .integer("Must be an integer")
        .test("occurrence-check", function (value) {
          const { period } = this.parent;

          let min, max, periodName;

          if (period === "minutes") {
            min = 5;
            max = 60;
            periodName = "minutes";
          } else if (period === "hours") {
            min = 1;
            max = 24;
            periodName = "hours";
          } else if (period === "days") {
            min = 1;
            max = 31;
            periodName = "days";
          } else if (period === "weeks") {
            min = 1;
            max = 52;
            periodName = "weeks";
          } else if (period === "months") {
            min = 1;
            max = 12;
            periodName = "months";
          }

          if (value < min || value > max) {
            return this.createError({
              message: `Frequency must be between ${min} and ${max} for ${periodName}.`,
            });
          }

          return true;
        }),
      period: Yup.string().required("Duration is required"),
    }),
  }),
  buttons: [
    {
      label: "Save",
      type: "submit",
      color: "primary",
      grid: 2,
    },
    {
      label: "Cancel",
      type: "button",
      color: "primary",
      variant: "outlined",
      grid: 2,
    },
  ],
};

const user = {
  fields: [
    {
      name: "FirstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      grid: 6,
      icon: Person,
    },
    {
      name: "LastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      grid: 6,
      icon: Person,
    },
    {
      name: "EmailAddress",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      grid: 6,
      icon: Email,
    },
    {
      name: "PhoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "Enter phone number",
      grid: 6,
      icon: Phone,
    },
    {
      name: "Password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      grid: 6,
      icon: Lock,
    },
    {
      name: "ConfirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Re-enter password",
      grid: 6,
      icon: Lock,
    },
  ],
  validationSchema: Yup.object({
    FirstName: Yup.string().required("First name is required"),
    LastName: Yup.string().required("Last name is required"),
    EmailAddress: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    PhoneNumber: Yup.string().matches(
      /^\d{10}$/,
      "Phone number must be 10 digits"
    ),
    Password: passwordValidationSchema,
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref("Password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  }),
  buttons: [
    {
      label: "Save",
      type: "submit",
      color: "primary",
      grid: 2,
    },
    {
      label: "Back",
      type: "button",
      color: "primary",
      variant: "outlined",
      grid: 2,
    },
  ],
};

const changepassword = {
  fields: [
    {
      name: "OldPassword",
      label: "Old Password",
      type: "password",
      placeholder: "Enter your old password",
      grid: 3,
      icon: Lock,
    },
    {
      name: "Spacer",
      type: "spacer",
      grid: 9,
    },
    {
      name: "Password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      grid: 3,
      icon: Lock,
    },
    {
      name: "Spacer",
      type: "spacer",
      grid: 9,
    },
    {
      name: "ConfirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Re-enter password",
      grid: 3,
      icon: Lock,
    },
  ],
  validationSchema: Yup.object().shape({
    OldPassword: passwordValidationSchema,
    Password: passwordValidationSchema,
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref("Password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  }),
  buttons: [
    {
      label: "Change Password",
      type: "submit",
      color: "primary",
      grid: 2,
    },
  ],
};

export { login, signup, profile, userProfile, user, changepassword };
