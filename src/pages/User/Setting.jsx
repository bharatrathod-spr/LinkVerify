import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { Form, Formik } from "formik";
import useFetchUserAlerts from "../../hooks/useSetting";
import { toast } from "react-toastify";
import MailConfigModal from "../../components/Forms/MailConfigModal";
import { jwtDecode } from "jwt-decode";

const Settings = () => {
  const { alerts, loading, handleUpdate, handleSlackAlert } =
    useFetchUserAlerts();

  const [subscriptionState, setSubscriptionState] = useState({});
  const [frequencyState, setFrequencyState] = useState({});

  const alertMap = {
    Slack: "slack",
    Email: "email",
    Sms: "sms",
  };

  const handleSubscribeClick = async (key) => {
    if (alertMap[key]) {
      try {
        const frequency = frequencyState[key] || "only_one_time";

        setSubscriptionState((prev) => ({ ...prev, [key]: true }));

        const response = await handleSlackAlert({
          type: alertMap[key],
          frequency,
        });

        toast.success(
          response.message || `${key} subscription updated successfully.`
        );

        setSubscriptionState((prev) => ({
          ...prev,
          [key]: !prev[key],
        }));

        if (!subscriptionState[key]) {
          setFrequencyState((prev) => ({
            ...prev,
            [key]: "only_one_time",
          }));
        } else {
          setFrequencyState((prev) => ({
            ...prev,
            [key]: undefined,
          }));
        }
      } catch (error) {
        toast.error(
          error || `Failed to update ${key} subscription. Please try again.`
        );
      } finally {
        setSubscriptionState((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleUnsubscribeClick = async (key) => {
    if (alertMap[key]) {
      try {
        setSubscriptionState((prev) => ({ ...prev, [key]: true }));

        const response = await handleSlackAlert({
          type: alertMap[key],
          frequency: "only_one_time",
        });

        toast.success(
          response.message || `${key} subscription updated successfully.`
        );

        setSubscriptionState((prev) => ({
          ...prev,
          [key]: false,
        }));

        setFrequencyState((prev) => ({
          ...prev,
          [key]: undefined,
        }));
      } catch (error) {
        toast.error(
          error || `Failed to update ${key} subscription. Please try again.`
        );
      } finally {
        setSubscriptionState((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleFrequencyChange = async (key, newFrequency) => {
    try {
      setFrequencyState((prev) => ({
        ...prev,
        [key]: newFrequency,
      }));

      const response = await handleSlackAlert({
        type: alertMap[key],
        frequency: newFrequency,
      });

      toast.success(`Frequency updated to ${newFrequency} for ${key}.`);
    } catch (error) {
      toast.error(
        error || `Failed to update frequency for ${key}. Please try again.`
      );
    }
  };

  const handleFormSubmit = (values) => {
    handleUpdate(values);
  };

  useEffect(() => {
    if (alerts) {
      const initialState = Object.keys(alerts).reduce((acc, key) => {
        acc[key] = alerts[key]?.Subscriber || false;
        return acc;
      }, {});
      setSubscriptionState(initialState);
    }
  }, [alerts]);
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;
  const [openMailModal, setOpenMailModal] = useState(false);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{ padding: 2, marginTop: 2, position: "relative" }}
        >
          <Formik initialValues={alerts} onSubmit={handleFormSubmit}>
            {({ values, handleChange }) => (
              <Form>
                <TableContainer component={Paper}>
                  <Typography variant="h6" sx={{ padding: "16px" }}>
                    Alert Subscriptions
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subscriber Preferences</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">Frequency</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(alerts).map((key, index) => (
                        <TableRow key={index}>
                          <TableCell>{key}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant={
                                subscriptionState[key]
                                  ? "outlined"
                                  : "contained"
                              }
                              color={
                                subscriptionState[key] ? "secondary" : "primary"
                              }
                              onClick={() =>
                                subscriptionState[key]
                                  ? handleUnsubscribeClick(key)
                                  : handleSubscribeClick(key)
                              }
                            >
                              {subscriptionState[key]
                                ? "Unsubscribe"
                                : "Subscribe"}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            {subscriptionState[key] ? (
                              <select
                                value={frequencyState[key] || "per_minute"}
                                onChange={(e) =>
                                  handleFrequencyChange(key, e.target.value)
                                }
                                style={{
                                  padding: "8px 12px",
                                  fontSize: "14px",
                                  borderRadius: "4px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#fff",
                                  cursor: "pointer",
                                }}
                              >
                                <option value="per_minute">Per Minute</option>
                                <option value="only_one_time">Once</option>
                                <option value="per_hour">Hourly</option>
                                <option value="per_5_hours">
                                  Every 5 Hours
                                </option>
                                <option value="per_day">Daily</option>
                              </select>
                            ) : (
                              <Typography variant="body2" color="error">
                                Frequency not found
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Form>
            )}
          </Formik>
        </Paper>
      )}
      <MailConfigModal
        open={openMailModal}
        handleClose={() => setOpenMailModal(false)}
        userId={userId}
      />
    </Box>
  );
};

export default Settings;
