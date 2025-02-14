import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAlerts,
  updateUserAlerts,
  toggleSubscription,
  setAlertFrequency,
} from "../actions/settingActions";

const useFetchUserAlerts = () => {
  const dispatch = useDispatch();
  const { alerts, loading, error } = useSelector((state) => state.setting);
  const [isAlertsLoaded, setIsAlertsLoaded] = useState(false);

  useEffect(() => {
    if (!isAlertsLoaded && !loading && !alerts.length) {
      dispatch(fetchUserAlerts());
      setIsAlertsLoaded(true);
    }
  }, [dispatch, isAlertsLoaded, loading, alerts]);

  const handleUpdate = (payload) => {
    return dispatch(updateUserAlerts(payload));
  };

  const handleToggleSubscription = async (type) => {
    try {
      const response = await dispatch(toggleSubscription(type)).unwrap();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSetFrequency = async (type, frequency) => {
    try {
      const response = await dispatch(
        setAlertFrequency({ type, frequency })
      ).unwrap();
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    alerts,
    loading,
    error,
    handleUpdate,
    handleToggleSubscription,
    handleSetFrequency,
  };
};

export default useFetchUserAlerts;
