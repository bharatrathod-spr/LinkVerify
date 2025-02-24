import React from "react";
import { Formik, Form, Field, getIn } from "formik";
import { Button, Box, Grid } from "@mui/material";
import { toast } from "react-toastify";
import Input from "../../components/Forms/Input";
import Select from "../../components/Forms/Select";
import Checkbox from "../../components/Forms/Checkbox";

const DynamicForm = ({
  config,
  onSubmit,
  initialValues: externalInitialValues,
  onClose,
  loading,
}) => {
  const { fields, validationSchema, buttons } = config;

  const defaultInitialValues = fields?.reduce((acc, field) => {
    if (field?.name.includes(".")) {
      const [parent, child] = field?.name.split(".");
      acc[parent] = acc[parent] || {};
      acc[parent][child] =
        field?.type === "select"
          ? ""
          : field?.type !== "spacer"
          ? ""
          : undefined;
    } else {
      acc[field.name] =
        field?.type === "select"
          ? ""
          : field?.type !== "spacer"
          ? ""
          : undefined;
    }
    return acc;
  }, {});

  const filteredInitialValues =
    externalInitialValues &&
    Object.keys(defaultInitialValues).reduce((acc, key) => {
      if (
        typeof defaultInitialValues[key] === "object" &&
        !Array.isArray(defaultInitialValues[key])
      ) {
        acc[key] = Object.keys(defaultInitialValues[key]).reduce(
          (nestedAcc, childKey) => {
            if (externalInitialValues[key]?.hasOwnProperty(childKey)) {
              nestedAcc[childKey] = externalInitialValues[key][childKey];
            }
            return nestedAcc;
          },
          {}
        );
      } else if (externalInitialValues?.hasOwnProperty(key)) {
        acc[key] = externalInitialValues[key];
      }
      return acc;
    }, {});

  const initialValues = { ...defaultInitialValues, ...filteredInitialValues };

  const hasFormChanged = (values) => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        if (hasFormChanged(values)) {
          const changedValues = Object.keys(values).reduce((acc, key) => {
            if (
              JSON.stringify(values[key]) !== JSON.stringify(initialValues[key])
            ) {
              acc[key] = values[key];
            }
            return acc;
          }, {});
          onSubmit(changedValues, actions);
        } else {
          toast.warning("Change any one field at least.");
        }
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid container spacing={2}>
            {fields.map((field) =>
              field.type === "spacer" ? (
                <Grid
                  item
                  xs={12}
                  sm={field.grid || 12}
                  key={field.name}
                ></Grid>
              ) : ( 
                <Grid item xs={12} sm={field.grid || 12} key={field.name}>
                  <Field name={field.name}>
                    {({ field: formikField }) =>
                      field.type === "checkbox" ? (
                        <Checkbox
                          {...formikField}
                          checked={formikField.value}
                          label={field.label}
                          color="primary"
                        />
                      ) : field.type === "select" ? (
                        <Select
                          {...formikField}
                          label={field.label}
                          placeholder={field.placeholder}
                          error={
                            getIn(touched, field.name) &&
                            Boolean(getIn(errors, field.name))
                          }
                          helperText={
                            getIn(touched, field.name) &&
                            getIn(errors, field.name)
                          }
                          field={field}
                        />
                      ) : (
                        <Input
                          {...formikField}
                          field={field}
                          label={field.label}
                          placeholder={field.placeholder}
                          error={
                            getIn(touched, field.name) &&
                            Boolean(getIn(errors, field.name))
                          }
                          helperText={
                            getIn(touched, field.name) &&
                            getIn(errors, field.name)
                          }
                        />
                      )
                    }
                  </Field>
                </Grid>
              )
            )}
          </Grid>

          <Box sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
              {buttons?.map((button, index) => (
                <Grid item xs={12} sm={button.grid || 12} key={index}>
                  <Button
                    type={button.type}
                    variant={button.variant || "contained"}
                    color={button.color || "primary"}
                    onClick={
                      button.type === "button" ? onClose : button.onClick
                    }
                    fullWidth
                    disabled={loading && button.type === "submit"}
                  >
                    {button.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default DynamicForm;
