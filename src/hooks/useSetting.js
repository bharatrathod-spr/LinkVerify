import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAlerts,
  updateUserAlerts,
  postUserSlackAlerts,
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

  // const handleSlackAlert = async (type) => {
  //   return dispatch(postUserSlackAlerts({ Type: type })).unwrap();
  // };
  const handleSlackAlert = async (type) => {
    try {
      const response = await dispatch(
        postUserSlackAlerts({ Type: type })
      ).unwrap();
      return response;
    } catch (error) {
      throw error; // Re-throw error to handle it in the component
    }
  };

  return { alerts, loading, error, handleUpdate, handleSlackAlert };
};

export default useFetchUserAlerts;
