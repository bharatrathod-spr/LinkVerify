import React, { useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import Loader from "../../components/Common/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ProfileDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const validationProfileId = location.state?.ValidationProfileId;

  const { handleLogDetails, loading, selectedProfile } = useProfile();

  useEffect(() => {
    if (validationProfileId) {
      handleLogDetails(validationProfileId);
    }
  }, [validationProfileId]);
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          URL Audit Details
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          sx={{
            textTransform: "none",
            borderRadius: "5px",
            fontSize: "14px",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              borderColor: "#5951da",
              backgroundColor: "#5951da",
              color: "#fff",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          Back
        </Button>
      </Box>

      {loading ? (
        <Loader />
      ) : (
        <Paper
          elevation={5}
          sx={{
            padding: 3,
            marginTop: 2,
            borderRadius: 3,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {selectedProfile ? (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={3}
                    sx={{
                      marginBottom: 3,
                      borderRadius: 2,
                      boxShadow: 3,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Profile Information
                      </Typography>
                      <Table sx={{ minWidth: 350 }}>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Description
                            </TableCell>
                            <TableCell>
                              {selectedProfile.validationProfile?.Description}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Source Link
                            </TableCell>
                            <TableCell>
                              <a
                                href={
                                  selectedProfile.validationProfile?.SourceLink
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedProfile.validationProfile?.SourceLink}
                              </a>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Search Link
                            </TableCell>
                            <TableCell>
                              <a
                                href={
                                  selectedProfile.validationProfile?.SearchLink
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedProfile.validationProfile?.SearchLink}
                              </a>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Cron Expression
                            </TableCell>
                            <TableCell>
                              {
                                selectedProfile.validationProfile
                                  ?.CronExpression
                              }
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    elevation={3}
                    sx={{
                      marginBottom: 3,
                      borderRadius: 2,
                      boxShadow: 3,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Audit Summary
                      </Typography>
                      <Table sx={{ minWidth: 350 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Total Audits
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Success Count
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Failure Count
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              {selectedProfile.logSummary?.totalValidations}
                            </TableCell>
                            <TableCell>
                              {selectedProfile.logSummary?.successCount}
                            </TableCell>
                            <TableCell>
                              {selectedProfile.logSummary?.failureCount}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {selectedProfile.logSummary?.failureCount !== 0 && (
                <Card
                  elevation={3}
                  sx={{
                    marginBottom: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#d32f2f" }}
                    >
                      Recent Failure Reasons
                    </Typography>

                    {selectedProfile.logSummary?.recentFailureReasons?.length >
                    0 ? (
                      <Table sx={{ minWidth: 350 }}>
                        <TableBody>
                          {selectedProfile.logSummary.recentFailureReasons.map(
                            (reason, index) =>
                              reason.length > 0 && (
                                <TableRow key={index}>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Failure #{index + 1}
                                  </TableCell>
                                  <TableCell>{reason.join(", ")}</TableCell>
                                </TableRow>
                              )
                          )}
                        </TableBody>
                      </Table>
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#757575",
                          textAlign: "center",
                          padding: 2,
                        }}
                      >
                        No Audit details found.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Typography variant="h6" color="textSecondary">
              No Audit details found.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ProfileDetail;
