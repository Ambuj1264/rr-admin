import React, { useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Container,
  Autocomplete,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { createStyles, makeStyles } from "@mui/styles";
import {
  TextField,
  Button,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { errorToast, successToast } from "src/utils/toaster";
import * as Yup from "yup";
import { useMutation, useQuery } from "@apollo/client";
import { reservationFormMutation } from "src/hook/mutations/reservationForm";
import SuspenseLoader from "src/components/SuspenseLoader";
import { servicesListingQuery } from "src/hook/query/services";

function pAddReservationForm() {
  const classes = useStyles();
  const authKey = localStorage.getItem("TOKEN");

  const initialValues = {
    service: null,
    fields: [{ label: "", required: false }],
  };

  const [reservationFormMutate, { loading }] = useMutation(
    reservationFormMutation,
    {
      context: {
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      },
    }
  );
  const {
    loading: ServiceLoading,
    data: ServiceData,
    refetch: serviceRefetch,
  } = useQuery(servicesListingQuery, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });

  const validationSchema = Yup.object().shape({
    service: Yup.mixed().required("Service is required"),
    fields: Yup.array().of(
      Yup.object().shape({
        label: Yup.string()
          .required("Label is required")
          .max(50, "Label cannot exceed 40 characters")
          .matches(/^[A-Za-z0-9!@#$%^&*()_+-=\[\]{}|;':",.<>/?]+( [A-Za-z0-9!@#$%^&*()_+-=\[\]{}|;':",.<>/?]+)*$/, "No extra space allowed"),
        required: Yup.boolean(),
      })
    ),
  });

  const handleSubmit = async (values, action) => {
    try {
      const selectedService = serviceArray?.find(
        (option) => option?.label === values?.service
      );
      if (selectedService) {
        const result = await reservationFormMutate({
          variables: {
            input: {
              serviceId: selectedService?.id, // Include id of the selected service
              serviceName: selectedService?.label, // Include service name
              fields: values?.fields,
            },
          },
        });
        if (result?.data) {
          successToast("Your reservation form added successfully");
          action.resetForm();
        }
      } else {
        errorToast("Selected service not found");
      }
    } catch (error) {
      errorToast(error.message);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const addField = () => {
    formik.values.fields.push({ label: "", required: false });
    formik.setValues({ ...formik.values });
  };

  const deleteField = (index) => {
    if (formik.values.fields.length > 1) {
      formik.values.fields.splice(index, 1);
      formik.setValues({ ...formik.values });
    }
  };

  const handleFieldChange = (index, prop, value) => {
    formik.values.fields[index][prop] = value;
    formik.setValues({ ...formik.values });
  };

  interface serviceArrayInterface {
    id: string;
    label: string;
  }
  const serviceArray: serviceArrayInterface[] = (
    ServiceData?.serviceListing || []
  ).map((item) => ({
    id: item.id,
    label: item.serviceName,
  }));
  console.log(serviceArray, "afasdf");

  if (loading || ServiceLoading) {
    return <SuspenseLoader />;
  }

  console.log(formik.values.service, formik.errors.service, "sdfasfsadf");
  return (
    <>
      <Helmet>
        <title>Add Reservation Form</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Add Reservation Form" />
      </PageTitleWrapper>
      <Container maxWidth="md">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card className={classes.cardContainer}>
              <CardHeader title="Form" />
              <Divider />
              <CardContent>
                <Container
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <form onSubmit={formik.handleSubmit}>
                    <Grid sx={{ margin: "0 0 0 13px" }}>
                      <Autocomplete
                        disablePortal
                        id="service"
                        options={serviceArray}
                        getOptionLabel={(option: serviceArrayInterface) =>
                          option.label
                        }
                        sx={{ width: 244, mx: -0.5 }}
                        value={
                          serviceArray.find(
                            (option) => option.label === formik?.values.service
                          ) || null
                        }
                        onChange={(event, newValue: any) => {
                          formik.setFieldValue(
                            "service",
                            newValue ? newValue.label : ""
                          );
                          formik.setFieldTouched("service", true, false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Service"
                            name="service"
                            error={
                              formik.touched.service &&
                              Boolean(formik.errors.service)
                            }
                            helperText={
                              formik.touched.service && formik.errors.service
                            }
                            value={formik?.values.service || ""}
                          />
                        )}
                      />
                    </Grid>
                    <FormGroup
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        position: "inherit",
                      }}
                    >
                      {formik.values.fields.map((field, index) => (
                        <div key={index}>
                          <TextField
                            label="Label"
                            name={`fields[${index}].label`}
                            value={field.label}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ margin: "10px" }}
                            error={
                              formik?.touched?.fields &&
                              formik?.touched?.fields[index] &&
                              formik?.errors?.fields &&
                              formik?.errors?.fields[index]?.label
                            }
                            helperText={
                              formik?.touched?.fields &&
                              formik?.touched?.fields[index] &&
                              formik?.errors?.fields &&
                              formik?.errors?.fields[index]?.label
                            }
                          />

                          <FormControlLabel
                            style={{ margin: "20px" }}
                            control={
                              <Switch
                                checked={field.required}
                                name={`fields[${index}].required`}
                                onChange={() =>
                                  handleFieldChange(
                                    index,
                                    "required",
                                    !field.required
                                  )
                                }
                              />
                            }
                            label="Required"
                          />
                          {formik.values.fields.length > 1 && (
                            <Button
                              color="error"
                              variant="contained"
                              onClick={() => deleteField(index)}
                            >
                              -
                            </Button>
                          )}
                        </div>
                      ))}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          width: "50%",
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          color="primary"
                          sx={{ maxWidth: "100px" }}
                          variant="contained"
                          onClick={addField}
                        >
                          +
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          sx={{ maxWidth: "100px" }}
                        >
                          Submit
                        </Button>
                      </div>
                    </FormGroup>
                  </form>
                </Container>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <br />
    </>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    actionsContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "1rem",
    },
    cardContainer: {
      border: "0.5px solid #f0f0f0",
      boxShadow: "none",
    },
    forgetPassword: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1rem",
    },
  })
);

export default AddReservationForm;
