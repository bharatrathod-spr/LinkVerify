import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  verifyToken,
  loginUser,
  updateProfile,
  signUpUser,
  getUsers as fetchUsers,
  deleteUser,
  updateUser,
  createUser,
} from "../actions/userActions";
import { clearUser } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { clearActivity } from "../slices/activitySlice";
import { clearDashboard } from "../slices/dashboardSlice";
import { clearLog } from "../slices/logsSlice";
import { clearProfile } from "../slices/profileSlice";
import { clearSetting } from "../slices/settingSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error, users } = useSelector(
    (state) => state.user
  );
  const [activityLoader, setActivityloader] = useState(true);

  useEffect(() => {
    if (activityLoader && token && !user && !error && !loading) {
      dispatch(verifyToken());
      setActivityloader(false);
    }
  }, [dispatch, token, !user, activityLoader, loading, users]);

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const signup = (credentials) => {
    return dispatch(signUpUser(credentials));
  };

  const adduser = (createuser) => {
    return dispatch(createUser(createuser));
  };

  const handleUpdate = (credentials) => {
    return dispatch(updateProfile(credentials));
  };

  const handleUserUpdate = (userId, user) => {
    return dispatch(updateUser({ userId, user }));
  };

  const handleDelete = (userId) => {
    return dispatch(deleteUser(userId));
  };

  const getUsers = () => {
    return dispatch(fetchUsers());
  };

  const logout = () => {
    dispatch(clearUser());
    dispatch(clearActivity());
    dispatch(clearDashboard());
    dispatch(clearLog());
    dispatch(clearProfile());
    dispatch(clearSetting());
    navigate("/auth/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    users,
    login,
    signup,
    handleUpdate,
    handleUserUpdate,
    adduser,
    logout,
    getUsers,
    handleDelete,
  };
};
