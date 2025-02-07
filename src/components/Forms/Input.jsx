import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormGroup,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const Input = ({ field, ...formikField }) => {
  const [passwordVisibility, setPasswordVisibility] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  return (
    <FormGroup fullWidth>
      <TextField
        {...formikField}
        type={
          field.type === "password" && passwordVisibility[field.name]
            ? "text"
            : field.type
        }
        InputProps={{
          ...(field.type === "password" && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility(field.name)}
                  edge="end"
                >
                  {passwordVisibility[field.name] ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }),
          ...(field?.icon && {
            startAdornment: (
              <InputAdornment position="start">
                <field.icon />
              </InputAdornment>
            ),
          }),
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </FormGroup>
  );
};

export default Input;
