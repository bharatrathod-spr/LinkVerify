//useMail.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMailConfig,
  fetchMailById,
  addMailConfig,
  updateMailConfigurations,
  deleteMailConfig,
} from "../actions/mailConfigActions";
import { jwtDecode } from "jwt-decode";

const useMailConfig = () => {
  const dispatch = useDispatch();
  const { mailConfigList, loading, error } = useSelector(
    (state) => state.mailconfig || {}
  );
  const [UserId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded?.UserId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (UserId) {
      dispatch(fetchMailConfig(UserId));
    }
  }, [UserId, dispatch]);

  const handleAddMailConfig = (config) => {
    return dispatch(addMailConfig({ UserId, config }));
  };

  const handleUpdateMailConfig = (config) => {
    return dispatch(
      updateMailConfigurations({
        ...config,
        MailConfigurationId: config.MailConfigurationId,
      })
    );
  };

  const handleDeleteMailConfig = (configId) => {
    return dispatch(deleteMailConfig({ UserId, configId }));
  };
  const handleFetchMailConfigById = (configId) => {
    dispatch(fetchMailById(configId));
  };

  return {
    mailConfigList,
    loading,
    error,
    handleAddMailConfig,
    handleUpdateMailConfig,
    handleDeleteMailConfig,
    handleFetchMailConfigById,
  };
};

export default useMailConfig;
