import React from "react";
import { FormControlLabel, Checkbox as MuiCheckBox } from "@mui/material";
import { CheckCircle, LensOutlined } from "@mui/icons-material";

const Checkbox = (formikField) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckBox
          icon={<LensOutlined />}
          checkedIcon={<CheckCircle color="success" />}
          {...formikField}
        />
      }
      label={formikField.label}
    />
  );
};

export default Checkbox;
