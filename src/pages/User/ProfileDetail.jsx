"use client"
import { useEffect } from "react"
import { Typography, Box, Paper, Grid, Button, Chip, Avatar } from "@mui/material"
import { useLocation } from "react-router-dom"
import { useProfile } from "../../hooks/useProfile"
import Loader from "../../components/Common/Loader"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useNavigate } from "react-router-dom"
import LinkIcon from "@mui/icons-material/Link"
import ScheduleIcon from "@mui/icons-material/Schedule"
import DescriptionIcon from "@mui/icons-material/Description"
import SearchIcon from "@mui/icons-material/Search"
import ErrorIcon from "@mui/icons-material/Error"
import WarningIcon from "@mui/icons-material/Warning"
import AssessmentIcon from "@mui/icons-material/Assessment"
import HistoryIcon from "@mui/icons-material/History"

const ProfileDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const validationProfileId = location.state?.ValidationProfileId

  const { handleLogDetails, loading, selectedProfile } = useProfile()

  useEffect(() => {
    if (validationProfileId) {
      handleLogDetails(validationProfileId)
    }
  }, [validationProfileId])

  const handleBack = () => {
    navigate(-1)
  }

  // Calculate success rate percentage
  const getSuccessRate = () => {
    if (!selectedProfile?.logSummary?.totalValidations) return 0
    return Math.round((selectedProfile.logSummary.successCount / selectedProfile.logSummary.totalValidations) * 100)
  }

  const successRate = getSuccessRate()

  return (
    <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header with gradient background */}
      <Paper
        elevation={0}
        sx={{
          padding: { xs: 2, sm: 3 },
          marginBottom: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: "url('https://placeholder.svg?height=200&width=400') no-repeat center right",
            backgroundSize: "contain",
            opacity: 0.1,
            zIndex: 0,
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#6366F1",
                  width: 48,
                  height: 48,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <AssessmentIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  My Backlinks Details
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Comprehensive analysis of your backlink validation
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontSize: "14px",
                padding: "8px 20px",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <Loader />
        </Box>
      ) : (
        <>
          {selectedProfile ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Status Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "stretch",
                  }}
                >
                  {/* Status Summary */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 3,
                      textAlign: "center",
                      backgroundColor: successRate > 80 ? "#f0f9f0" : successRate > 50 ? "#fff9e6" : "#feeeee",
                      borderRight: { xs: "none", md: "1px solid" },
                      borderBottom: { xs: "1px solid", md: "none" },
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        mb: 2,
                        position: "relative",
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6366F1" }}>
                        {successRate}%
                      </Typography>
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: "50%",
                          border: "4px solid",
                          borderColor: successRate > 80 ? "#4ade80" : successRate > 50 ? "#fbbf24" : "#f87171",
                          borderRightColor: "transparent",
                          transform: `rotate(${(successRate / 100) * 360}deg)`,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {successRate > 80
                        ? "Excellent Performance"
                        : successRate > 50
                          ? "Average Performance"
                          : "Needs Attention"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on {selectedProfile.logSummary?.totalValidations} total audits
                    </Typography>
                  </Box>

                  {/* Audit Stats */}
                  <Box sx={{ flex: 2, padding: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, display: "flex", alignItems: "center" }}>
                      <HistoryIcon sx={{ mr: 1, color: "#6366F1" }} />
                      Audit Summary
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#f8fafc",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Total Audits
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6366F1" }}>
                            {selectedProfile.logSummary?.totalValidations || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#f0f9f0",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Successful
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4ade80" }}>
                            {selectedProfile.logSummary?.successCount || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#feeeee",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Failed
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f87171" }}>
                            {selectedProfile.logSummary?.failureCount || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Paper>

              {/* Profile Information */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  padding: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, display: "flex", alignItems: "center" }}>
                  <DescriptionIcon sx={{ mr: 1, color: "#6366F1" }} />
                  Profile Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Name Of Your Item
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {selectedProfile.validationProfile?.Description || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "flex", alignItems: "center" }}
                      >
                        <LinkIcon fontSize="small" sx={{ mr: 0.5, color: "#6366F1" }} />
                        Site/Page To Crawl
                      </Typography>
                      <Button
                        variant="text"
                        component="a"
                        href={selectedProfile.validationProfile?.SourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LinkIcon />}
                        sx={{
                          textTransform: "none",
                          justifyContent: "flex-start",
                          pl: 0,
                          color: "#6366F1",
                          "&:hover": {
                            backgroundColor: "transparent",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {selectedProfile.validationProfile?.SourceLink || "N/A"}
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "flex", alignItems: "center" }}
                      >
                        <SearchIcon fontSize="small" sx={{ mr: 0.5, color: "#6366F1" }} />
                        Backlink to Track
                      </Typography>
                      <Button
                        variant="text"
                        component="a"
                        href={selectedProfile.validationProfile?.SearchLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<SearchIcon />}
                        sx={{
                          textTransform: "none",
                          justifyContent: "flex-start",
                          pl: 0,
                          color: "#6366F1",
                          "&:hover": {
                            backgroundColor: "transparent",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {selectedProfile.validationProfile?.SearchLink || "N/A"}
                      </Button>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "flex", alignItems: "center" }}
                      >
                        <ScheduleIcon fontSize="small" sx={{ mr: 0.5, color: "#6366F1" }} />
                        Cron Expression
                      </Typography>
                      <Chip
                        label={selectedProfile.validationProfile?.CronExpression || "N/A"}
                        size="small"
                        sx={{
                          backgroundColor: "#f0f4ff",
                          color: "#6366F1",
                          fontFamily: "monospace",
                          fontWeight: "medium",
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Failure Reasons */}
              {selectedProfile.logSummary?.failureCount !== 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    padding: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    backgroundColor: selectedProfile.logSummary?.failureCount > 0 ? "#fffbeb" : "white",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, display: "flex", alignItems: "center" }}>
                    <WarningIcon sx={{ mr: 1, color: "#f59e0b" }} />
                    Recent Failure Reasons
                  </Typography>

                  {selectedProfile.logSummary?.recentFailureReasons?.length > 0 ? (
                    <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                      {selectedProfile.logSummary.recentFailureReasons.map(
                        (reason, index) =>
                          reason.length > 0 && (
                            <Box
                              key={index}
                              sx={{
                                p: 2,
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: "rgba(255, 255, 255, 0.7)",
                                border: "1px solid",
                                borderColor: "rgba(245, 158, 11, 0.3)",
                                display: "flex",
                                alignItems: "flex-start",
                              }}
                            >
                              <ErrorIcon sx={{ color: "#f87171", mr: 1.5, mt: 0.3 }} />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                                  Failure #{index + 1}
                                </Typography>
                                <Typography variant="body2">{reason.join(", ")}</Typography>
                              </Box>
                            </Box>
                          ),
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "#757575" }}>
                        No failure details found.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                padding: 4,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: 2,
                }}
              >
                <SearchIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
              </Box>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                No Audit Details Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no audit details available for this profile.
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  )
}

export default ProfileDetail
