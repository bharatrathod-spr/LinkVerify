import { lazy } from "react";

// Lazy-loaded Pages
const Login = lazy(() => import("../pages/Auth/Login"));
const Signup = lazy(() => import("../pages/Auth/SignUp"));
const UserDashboard = lazy(() => import("../pages/User/UserDashboard"));
const ProfileTable = lazy(() => import("../pages/User/ProfileTable"));
const ProfileDetail = lazy(() => import("../pages/User/ProfileDetail"));
const LogsTable = lazy(() => import("../pages/User/LogsTable"));
const Profile = lazy(() => import("../pages/User/UserProfile"));
const UserActivities = lazy(() => import("../pages/User/ActivityTable"));
const Setting = lazy(() => import("../pages/User/Setting"));
const ChangePassword = lazy(() => import("../pages/User/ChangePassword"));
const MailConfiguration = lazy(() => import("../pages/User/MailConfiguration"));
const ForgotPassword = lazy(() => import("../pages/User/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/User/ResetPassword"));

const SuperUserDashboard = lazy(() =>
  import("../pages/SuperUser/SuperUserDashboard")
);
const UsersTable = lazy(() => import("../pages/SuperUser/UsersTable"));

const NotFound = lazy(() => import("../pages/Error/NotFound"));

const pages = {
  Login,
  Signup,
  UserDashboard,
  ProfileTable,
  ProfileDetail,
  LogsTable,
  Profile,
  NotFound,
  UserActivities,
  SuperUserDashboard,
  UsersTable,
  Setting,
  MailConfiguration,
  ChangePassword,
  ResetPassword,
  ForgotPassword,
};

export default pages;
