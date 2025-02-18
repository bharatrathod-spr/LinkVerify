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
import MailSetModal from "./MailSetModal";
import {
  toggleSubscription,
  setAlertFrequency,
} from "../../actions/settingActions";
import { useDispatch } from "react-redux";

const Settings = () => {
  const dispatch = useDispatch();
  const { alerts, loading, handleUpdate } = useFetchUserAlerts();

  const [subscriptionState, setSubscriptionState] = useState({});
  const [frequencyState, setFrequencyState] = useState({});
  const [selectedMailConfig, setSelectedMailConfig] = useState(null);
  const [openMailModal, setOpenMailModal] = useState(false);

  const alertMap = {
    Slack: "slack",
    Email: "email",
    Sms: "sms",
  };

  useEffect(() => {
    if (alerts) {
      const initialSubscriptionState = Object.keys(alerts).reduce(
        (acc, key) => {
          acc[key] = alerts[key]?.Subscriber || false;
          return acc;
        },
        {}
      );
      setSubscriptionState(initialSubscriptionState);

      const initialFrequencyState = Object.keys(alerts).reduce((acc, key) => {
        acc[key] = alerts[key]?.Frequency || "only_one_time";
        return acc;
      }, {});
      setFrequencyState(initialFrequencyState);

      if (alerts.Email?.MailConfigurationId) {
        setSelectedMailConfig(alerts.Email.MailConfigurationId);
      }
    }
  }, [alerts]);

  const handleSubscribeClick = async (key) => {
    if (alertMap[key]) {
      try {
        setSubscriptionState((prev) => ({ ...prev, [key]: !prev[key] }));

        await dispatch(toggleSubscription(alertMap[key]));

        toast.success(`${key} subscription updated successfully!`);

        if (key === "Email" && !subscriptionState[key]) {
          setTimeout(() => {
            setOpenMailModal(true);
          }, 500);
        } else if (key === "Email" && subscriptionState[key]) {
          setOpenMailModal(false);
        }
      } catch (error) {
        toast.error(
          error || `Failed to update ${key} subscription. Please try again.`
        );
      }
    }
  };

  const handleFrequencyChange = async (key, newFrequency) => {
    try {
      setFrequencyState((prev) => ({ ...prev, [key]: newFrequency }));

      await dispatch(
        setAlertFrequency({ type: alertMap[key], frequency: newFrequency })
      );

      toast.success(`Frequency updated to ${newFrequency} for ${key}.`);
    } catch (error) {
      toast.error(
        error || `Failed to update frequency for ${key}. Please try again.`
      );
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
        Alert Subscriptions
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
          <Formik initialValues={alerts} onSubmit={handleUpdate}>
            {() => (
              <Form>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subscriber Preferences</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">Frequency</TableCell>
                        <TableCell align="center">Mail Configuration</TableCell>
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
                              onClick={() => handleSubscribeClick(key)}
                            >
                              {subscriptionState[key]
                                ? "Unsubscribe"
                                : "Subscribe"}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            {subscriptionState[key] ? (
                              <select
                                value={frequencyState[key] || "only_one_time"}
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
                                Frequency not set
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {key === "Email" && (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setOpenMailModal(true)}
                                disabled={!subscriptionState[key]}
                              >
                                Select Mail Configuration
                              </Button>
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

      <MailSetModal
        open={openMailModal}
        handleClose={() => setOpenMailModal(false)}
        selectedMailConfig={selectedMailConfig}
        setSelectedMailConfig={setSelectedMailConfig}
      />
    </Box>
  );
};

export default Settings;
