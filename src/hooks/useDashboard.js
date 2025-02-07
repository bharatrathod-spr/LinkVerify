import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSuperUserData, fetchUserData } from "../actions/dashboardActions";

export const useDashboard = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, graphdata, pannelData, error, userCount } = useSelector(
    (state) => state.dashboard
  );

  const [activityLoader, setActivityloader] = useState(true);

  useEffect(() => {
    if (
      activityLoader &&
      !graphdata &&
      !userCount &&
      !pannelData &&
      isAuthenticated &&
      !!user
    ) {
      if (user.Role === "user") {
        dispatch(fetchUserData());
      }

      if (user.Role === "super_user") {
        dispatch(fetchSuperUserData());
      }

      setActivityloader(false);
    }
  }, [dispatch, !user, activityLoader, loading, graphdata, pannelData, userCount, error]);

  return {
    loading,
    graphdata,
    userCount,
    pannelData,
    error,
  };
};
