import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchActivity } from "../actions/activityActions";

export const useActivity = () => {
  const dispatch = useDispatch();
  const { loading, error, activities } = useSelector((state) => state.activity);

  const [activityLoader, setActivityloader] = useState(true);

  useEffect(() => {
    if (activityLoader && !error && !loading) {
      dispatch(fetchActivity());
      setActivityloader(false);
    }
  }, [dispatch, activityLoader, loading, activities, error]);

  return {
    loading,
    error,
    activities,
  };
};
