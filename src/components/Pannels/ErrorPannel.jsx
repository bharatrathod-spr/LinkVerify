import React from "react";
import {
  Typography,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const ErrorPanel = ({ errors }) => {
  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="h6">Last 10 Error Frequency</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Error Message</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errors?.length > 0 ? (
                errors?.map((error, index) => (
                  <TableRow key={index}>
                    <TableCell>{error.FailureReasons}</TableCell>
                    <TableCell>
                      {new Date(error.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>No errors available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ErrorPanel;
