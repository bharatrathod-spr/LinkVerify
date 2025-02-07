import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchLogs } from "../actions/logsActions";

// export const useLogs = () => {
//   const dispatch = useDispatch();
//   const { loading, error, logs } = useSelector((state) => state.logs);

//   const [activityLoader, setActivityloader] = useState(true);

//   useEffect(() => {
//     if (activityLoader && !error && !loading) {
//       dispatch(fetchLogs());
//       setActivityloader(false);
//     }
//   }, [dispatch, activityLoader, loading, logs, error]);

//   return {
//     loading,
//     error,
//     logs,
//   };
// };

export const useLogs = () => {
  const dispatch = useDispatch();
  const { loading, error, logs } = useSelector((state) => state.logs);

  const [activityLoader, setActivityLoader] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (activityLoader && selectedDate) {
      dispatch(fetchLogs({ date: selectedDate }));
      setActivityLoader(false);
    }
  }, [dispatch, activityLoader, selectedDate]);

  const updateDate = (date) => {
    setSelectedDate(date);
    setActivityLoader(true); 
  };

  return {
    loading,
    error,
    logs,
    updateDate,
  };
};
