import React from "react";
import DynamicForm from "./DynamicForm";
import {
  login,
  profile,
  signup,
  userProfile,
  user,
  changepassword,
} from "./formConfigs";
import { useAuth } from "../../hooks/useAuth";
import * as Yup from "yup";

const LoginForm = ({ initialValues, loading }) => {
  const { login: handleLogin } = useAuth();

  return (
    <DynamicForm
      config={login}
      onSubmit={handleLogin}
      initialValues={initialValues}
      loading={loading}
    />
  );
};

const SignUpForm = ({ initialValues, loading }) => {
  const { signup: handleSignUp } = useAuth();

  return (
    <DynamicForm
      config={signup}
      onSubmit={handleSignUp}
      initialValues={initialValues}
      loading={loading}
    />
  );
};

const ProfileForm = ({ initialValues, onClose, handleSubmit }) => {
  return (
    <DynamicForm
      config={profile}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      onClose={onClose}
    />
  );
};

const UserProfileForm = ({ initialValues, onClose, handleSubmit }) => {
  return (
    <DynamicForm
      config={userProfile}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};

const configureFields = (user, id) => {
  const updatedUser = { ...user };
  updatedUser.fields = id
    ? updatedUser.fields.filter(
        (field) => field.name !== "Password" && field.name !== "ConfirmPassword"
      )
    : updatedUser.fields;

  updatedUser.validationSchema = id
    ? Yup.object({
        ...updatedUser.validationSchema.fields,
        Password: undefined,
        ConfirmPassword: undefined,
      })
    : updatedUser.validationSchema;
  return updatedUser;
};

const UserForm = ({ initialValues, onClose, handleSubmit, id }) => {
  const config = configureFields(user, id);

  return (
    <DynamicForm
      config={config}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  ); 
};

const ChangePasswordForm = ({ initialValues, onClose, handleSubmit, id }) => {
  // const config = configureFields(user, id);

  return (
    <DynamicForm
      config={changepassword}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};

export {
  LoginForm,
  SignUpForm,
  ProfileForm,
  UserProfileForm,
  UserForm,
  ChangePasswordForm,
};
