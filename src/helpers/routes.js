// Layouts
import Auth from "../components/Layouts/Auth";
import User from "../components/Layouts/User";

// pages
import pages from "./pages";

import {
  AlignHorizontalLeftRounded,
  BarChartRounded,
  WidgetsRounded,
  PeopleRounded,
} from "./icons";

const routes = [
  {
    layout: "/auth",
    component: Auth,
    pages: [
      {
        title: "Login",
        path: "login",
        component: pages.Login,
        description:
          "Access your account on SEO Link Validator. Enter your credentials to manage and analyze your website links effectively.",
        keywords: "login, SEO tool login, account access, SEO Link Validator",
      },
      {
        title: "Sign Up",
        path: "sign-up",
        component: pages.Signup,
        description:
          "Create a new account on SEO Link Validator. Sign up to enhance your website's link validation and SEO optimization.",
        keywords:
          "sign up, create account, SEO tools, register SEO Link Validator",
      },
    ],
  },
  {
    layout: "/user",
    component: User,
    allowedRoles: ["user"],
    pages: [
      {
        title: "Dashboard",
        path: "",
        component: pages.UserDashboard,
        icon: WidgetsRounded,
        isDisplay: true,
        description:
          "Your personal dashboard for managing and tracking website link validation and SEO performance.",
        keywords: "dashboard, user dashboard, SEO tools, link tracking",
      },
      {
        title: "URL Audit Profile",
        path: "URLAuditProfile",
        component: pages.ProfileTable,
        icon: BarChartRounded,
        isDisplay: true,
        description:
          "View and manage your website's URL Audit Profiles. Track and analyze SEO link data effortlessly.",
        keywords:
          "validation profile,URL Audit Profile, SEO link management, profile tracking",
      },
      {
        title: "Audit Logs",
        path: "AuditLogs",
        component: pages.LogsTable,
        icon: AlignHorizontalLeftRounded,
        isDisplay: true,
        description:
          "Access detailed logs of your website's link validations and SEO performance metrics.",
        keywords:
          "validation logs,Audit Logs, SEO logs, link tracking logs, performance logs",
      },
      {
        title: "URL Audit Profile Details",
        path: "validation-profile-details",
        component: pages.ProfileDetail,
        description:
          "Explore detailed information about specific URL Audit Profiles. Optimize link performance effectively.",
        keywords:
          "profile details, validation details, SEO analysis, link optimization",
      },
      // {
      //   title: "Add Validation Profile",
      //   path: "add-validation-profile",
      //   component: pages.ValidationProfileForm,
      //   description:
      //     "Create and customize a new validation profile to track your website's SEO link performance.",
      //   keywords:
      //     "add profile, create validation profile, SEO tools, link management",
      // },
      {
        title: "User Profile",
        path: "profile",
        component: pages.Profile,
        description:
          "Manage your personal account settings and preferences on SEO Link Validator.",
        keywords: "profile, account settings, user profile, SEO tools",
      },
      {
        title: "Change Password",
        path: "changepassword",
        component: pages.ChangePassword,
        description:
          "Change your account password by entering the old password and setting a new one. Ensure the new password matches the confirmation field.",
        keywords:
          "change password, old password, new password, confirm password, account security, update password",
      },
      {
        title: "User Activities",
        path: "activities",
        component: pages.UserActivities,
        description:
          "Track and monitor your recent activities on SEO Link Validator to optimize workflow.",
        keywords: "user activities, activity logs, tracking, SEO tools",
      },
      {
        title: "Settings",
        path: "settings",
        component: pages.Setting,
        description:
          "Configure your account and application settings for a personalized experience.",
        keywords:
          "settings, user settings, SEO customization, account configuration",
      },
    ],
  },
  {
    layout: "/super_user",
    component: User,
    allowedRoles: ["super_user"],
    pages: [
      {
        title: "Dashboard",
        path: "",
        component: pages.SuperUserDashboard,
        icon: WidgetsRounded,
        isDisplay: true,
        description:
          "Admin dashboard for super users to manage and oversee link validations and user activity.",
        keywords:
          "super user dashboard, admin panel, SEO management, link validation",
      },
      {
        title: "Users",
        path: "users",
        component: pages.UsersTable,
        icon: PeopleRounded,
        isDisplay: true,
        description:
          "Manage user accounts and permissions effectively as a super user.",
        keywords:
          "user management, admin tools, SEO user permissions, account management",
      },
    ],
  },
];

export default routes;
