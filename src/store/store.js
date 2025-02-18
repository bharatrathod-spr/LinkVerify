import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import dashboardSlice from "../slices/dashboardSlice";
import profileSlice from "../slices/profileSlice";
import logsSlice from "../slices/logsSlice";
import activitySlice from "../slices/activitySlice";
import settingSlice from "../slices/settingSlice";
import mailconfigSlice from "../slices/mailSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    dashboard: dashboardSlice,
    profile: profileSlice,
    logs: logsSlice,
    activity: activitySlice,
    setting: settingSlice,
    mailconfig: mailconfigSlice,
  },
});

export default store;
