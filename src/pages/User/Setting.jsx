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
  Modal,
} from "@mui/material";
import { Form, Formik } from "formik";
import useFetchUserAlerts from "../../hooks/useSetting";
import { toast } from "react-toastify";

const Settings = () => {
  const { alerts, loading, error, handleUpdate, handleSlackAlert } =
    useFetchUserAlerts();

  const [subscriptionState, setSubscriptionState] = useState({});

  const [open, setOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState("");

  const toggleSubscription = (key) => {
    setSubscriptionState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const alertMap = {
    Slack: "slack",
    Email: "email",
    Sms: "sms",
  };

  // const handleSubscribeClick = (key) => {
  //   if (alertMap[key]) {
  //     handleSlackAlert(alertMap[key]);
  //   }

  //   setSubscriptionState((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

  const handleSubscribeClick = async (key) => {
    if (alertMap[key]) {
      try {
        const response = await handleSlackAlert(alertMap[key]);

        toast.success(
          response.message || `${key} subscription updated successfully.`
        );

        // Update state only on success
        setSubscriptionState((prev) => ({
          ...prev,
          [key]: !prev[key],
        }));
      } catch (error) {
        toast.error(
          error || `Failed to update ${key} subscription. Please try again.`
        );
      }
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setCurrentKey("");
  };

  const handleModalJoinNow = () => {
    toggleSubscription(currentKey);
    handleModalClose();
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 3 }}
                >
                  Update Settings
                </Button> */}
              </Form>
            )}
          </Formik>
        </Paper>
      )}
    </Box>
  );
};

export default Settings;
