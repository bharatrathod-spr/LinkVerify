import React from "react";
import { Typography, Box, Card, CardContent, IconButton } from "@mui/material";

// This card component is used in super-user dashboard

const UserCard = ({ label, count, icons }) => {
  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {label} : {count}
          </Typography>
          <IconButton color="primary" sx={{ cursor: "auto" }}>
            {icons}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;
