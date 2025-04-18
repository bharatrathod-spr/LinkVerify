import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Grid,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import TableLayout from "../../components/Table/TableLayout";
import moment from "moment";
import ProfileModal from "../../components/Modals/ProfileModal";
import { useProfile } from "../../hooks/useProfile";
import Loader from "../../components/Common/Loader";

const headerData = [
  {
    field: "Description",
    label: "Description",
    width: "13%",
    isOverflow: true,
  },
  { field: "SourceLink", label: "Source URL", width: "18%", isOverflow: true },
  { field: "SearchLink", label: "Search URL", width: "18%", isOverflow: true },
  { field: "CronExpression", label: "Cron Expression", width: "12%" },
  { field: "LastErrorAt", label: "Last Error At", width: "12%" },
  { field: "LastSuccessAt", label: "Last Success At", width: "12%" },
  { field: "actions", label: "Actions", width: "15%", align: "center" },
];

const mobileHeaderData = [
  { field: "SourceLink", label: "Source URL", width: "35%" },
  { field: "SearchLink", label: "Search URL", width: "30%" },
  { field: "actions", label: "Actions", width: "35%", align: "center" },
];

const ProfileTable = () => {
  const [open, setOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const { profiles, loading, handleDelete } = useProfile();

  const toggleModel = () => {
    setOpen(!open);
    if (open) {
      setProfileId(null);
    }
  };

  const renderActions = (profile) => (
    <Grid container justifyContent="center">
      <Grid item>
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            onClick={() => {
              setProfileId(profile.ValidationProfileId);
              toggleModel();
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Details">
          <IconButton
            color="default"
            component={Link}
            to="/user/validation-profile-details"
            state={{ ValidationProfileId: profile.ValidationProfileId }}
          >
            <Visibility />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Delete">
          <IconButton
            color="secondary"
            onClick={() => handleDelete(profile.ValidationProfileId)}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Typography variant="h5" gutterBottom>
          URL Audit Profile
        </Typography>
        <Button variant="contained" color="primary" onClick={toggleModel}>
          Add URL Audit Profile
        </Button>
      </Box>
      {loading && !profiles ? (
        <>
          <Loader />
        </>
      ) : (
        <Paper
          elevation={3}
          sx={{ padding: 2, marginTop: 2, position: "relative" }}
        >
          <TableLayout
            headerData={headerData}
            allData={profiles?.map((item) => ({
              ...item,
              actions: renderActions(item),
              LastErrorAt: item.LastErrorAt
                ? moment(new Date(item.LastErrorAt)).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                : "",
              LastSuccessAt: item.LastSuccessAt
                ? moment(new Date(item.LastSuccessAt)).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                : "",
            }))}
            sortingList={[
              "SourceLink",
              "SearchLink",
              "CronExpression",
              "LastErrorAt",
              "LastSuccessAt",
              "createdAt",
            ]}
            defaultSortOn="LastSuccessAt"
            dropdownSearchFields={[]}
            dateFilterField=""
            mobileHeaderData={mobileHeaderData}
            collapseFields={headerData
              .filter((header) => header.field !== "actions")
              .map((header) => header.field)}
          />
        </Paper>
      )}

      {open && (
        <ProfileModal open={open} onClose={toggleModel} profileId={profileId} />
      )}
    </Box>
  );
};

export default ProfileTable;
