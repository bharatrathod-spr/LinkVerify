import { FormControl, MenuItem, TextField } from "@mui/material";
import React from "react";

const Select = ({ field, ...formikField }) => {
  return (
    <FormControl fullWidth variant="outlined">
      <TextField {...formikField} select disabled={field.readOnly}>
        {field?.options?.map((option, idx) => (
          <MenuItem key={idx} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};

export default Select;
