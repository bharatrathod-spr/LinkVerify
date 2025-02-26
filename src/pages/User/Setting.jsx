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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [alertToUnsubscribe, setAlertToUnsubscribe] = useState(null);

  const alertMap = {
    Slack: "slack",
    Email: "email",
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
      if (subscriptionState[key]) {
        setAlertToUnsubscribe(key);
        setOpenConfirmModal(true);
      } else {
        if (key === "Email" && !selectedMailConfig) {
          setOpenMailModal(true);
        } else {
          await toggleSubscriptionAndProceed(key);
        }
      }
    }
  };

  const toggleSubscriptionAndProceed = async (key) => {
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
  };

  const handleConfirmUnsubscribe = async () => {
    if (alertToUnsubscribe) {
      await toggleSubscriptionAndProceed(alertToUnsubscribe);
      setOpenConfirmModal(false);
    }
  };

  const handleCancelUnsubscribe = () => {
    setOpenConfirmModal(false);
    setAlertToUnsubscribe(null);
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

  const handleMailConfigSave = async (configId) => {
    setSelectedMailConfig(configId);
    setOpenMailModal(false);
    await toggleSubscriptionAndProceed("Email");
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4, md: 5 },
        maxWidth: "100%",
        margin: "auto",
      }}
    >
      <Typography
        variant="h5"
        color="primary"
        sx={{
          fontWeight: "bold",
          marginBottom: 3,
          fontFamily: "'Roboto', sans-serif",
        }}
      >
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
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 2, sm: 4 },
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Formik initialValues={alerts} onSubmit={handleUpdate}>
            {() => (
              <Form>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: "8px", overflow: "hidden" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "primary.main",
                          borderBottom: "2px solid #e0e0e0",
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#fff",
                          }}
                        >
                          Subscriber Preferences
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#fff",
                          }}
                        >
                          Actions
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#fff",
                          }}
                        >
                          Frequency
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#fff",
                          }}
                        >
                          Mail Configuration
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(alerts).map((key, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? "#fafafa" : "#fff",
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#555",
                            }}
                          >
                            {key}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color={
                                subscriptionState[key] ? "error" : "success"
                              }
                              sx={{
                                padding: { xs: "6px 12px", sm: "8px 20px" },
                                textTransform: "none",
                                borderRadius: "5px",
                                fontWeight: "bold",
                                fontSize: { xs: "12px", sm: "14px" },
                              }}
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
                                  padding: "8px 16px",
                                  fontSize: "14px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#fff",
                                  cursor: "pointer",
                                  width: "150px",
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
                                sx={{
                                  padding: "8px 16px",
                                  textTransform: "none",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  borderRadius: "8px",
                                  "&:hover": {
                                    backgroundColor: "#e0f7fa",
                                  },
                                }}
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
        onSave={handleMailConfigSave}
        subscriptionState={subscriptionState}
        setSubscriptionState={setSubscriptionState}
      />

      <Dialog open={openConfirmModal} onClose={handleCancelUnsubscribe}>
        <DialogTitle>Confirm Unsubscribe</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to unsubscribe from {alertToUnsubscribe}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUnsubscribe} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUnsubscribe} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
