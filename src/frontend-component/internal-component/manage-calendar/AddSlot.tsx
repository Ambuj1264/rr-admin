import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Container,
  FormLabel,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { createStyles, makeStyles } from "@mui/styles";
import { TextField, Button, FormGroup } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@apollo/client";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useNavigate } from "react-router-dom";
import { manageSlotMutation } from "src/hook/mutations/manage-slot";
import { errorToast, successToast } from "src/utils/toaster";
import { manageSlotsQuery } from "src/hook/query/slot";
function AddSlot() {
  const classes = useStyles();
  const authKey = localStorage.getItem("TOKEN");
  const navigate = useNavigate();
  const [slotMutate, { loading }] = useMutation(manageSlotMutation, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });
  const { loading: queryLoading, refetch } = useQuery(manageSlotsQuery, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });

  const validationSchema = Yup.object().shape({
    startTime: Yup.string()
      .matches(
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid start time format (HH:MM)"
      )
      .required("Start Time is required"),
    endTime: Yup.string()
      .test(
        "endTime",
        "End time must be later than start time",
        function (value) {
          const { startTime } = this.parent;
          if (startTime && value) {
            const startTimeAsDate = new Date(`2023-01-01T${startTime}`);
            const endTimeAsDate = new Date(`2023-01-01T${value}`);
            return endTimeAsDate > startTimeAsDate;
          }
          return true;
        }
      )
      .matches(
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid end time format (HH:MM)"
      )
      .required("End Time is required"),
    reservationDate: Yup.date().required("Date is required"),
  });

  const {
    values: valueData,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      startTime: "00:00",
      endTime: "00:00",
      reservationDate: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (values: any, action: any) => {
      try {
        const result = await slotMutate({
          variables: {
            input: {
              endTime: values?.endTime,
              startDate: values?.reservationDate,
              startTime: values?.startTime,
            },
          },
        });
        if (result.data) {
          successToast("Slot created successfully");
          refetch();
          action.resetForm();
          navigate("/auth/calendar/slots");
        }
      } catch (error: any) {
        errorToast(error.message);
      }
    },
  });

  if (loading || queryLoading) {
    return <SuspenseLoader />;
  }
  function formatDate(date1: any) {
    const year1 = date1.getFullYear();
    const month1 = String(date1.getMonth() + 1).padStart(2, "0");
    const day1 = String(date1.getDate()).padStart(2, "0");
    return `${year1}-${month1}-${day1}`;
  }

  return (
    <>
      <Helmet>
        <title>Add Slot</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Add Slot" />
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
              <CardHeader title="Slot" />
              <Divider />
              <CardContent>
                <Container
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <form action="" onSubmit={handleSubmit}>
                    <Grid container spacing={3} className="grid-input-field">
                      <Grid item xs={12} sm={6}>
                        <FormGroup>
                          <FormLabel sx={{ marginBottom: "3px" }}>
                            Starting Time
                          </FormLabel>
                          <TextField
                            sx={{ width: "300px" }}
                            id="address"
                            name="startTime"
                            type="time"
                            fullWidth
                            variant="outlined"
                            value={valueData?.startTime}
                            onChange={handleChange}
                            error={
                              touched.startTime && Boolean(errors.startTime)
                            }
                            helperText={touched.startTime && errors.startTime}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormGroup>
                          <FormLabel sx={{ marginBottom: "3px" }}>
                            Closing Time
                          </FormLabel>
                          <TextField
                            id="address"
                            name="endTime"
                            type="time"
                            fullWidth
                            sx={{ width: "300px" }}
                            variant="outlined"
                            value={valueData?.endTime}
                            onChange={handleChange}
                            error={touched.endTime && Boolean(errors.endTime)}
                            helperText={touched.endTime && errors.endTime}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12} sm={6} marginBottom={3}>
                        <FormGroup>
                          <FormLabel sx={{ marginBottom: "3px" }}>
                            Date
                          </FormLabel>
                          <TextField
                            id="reservationDate"
                            name="reservationDate"
                            type="date"
                            fullWidth
                            sx={{ width: "300px" }}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true, // To make the label "shrink" when there's a value
                            }}
                            inputProps={{
                              min: formatDate(new Date()), // Use a function to format the date
                            }}
                            value={valueData?.reservationDate}
                            onChange={handleChange}
                            error={
                              touched.reservationDate &&
                              Boolean(errors.reservationDate)
                            }
                            helperText={
                              touched.reservationDate && errors.reservationDate
                            }
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>

                    <div className="grid-info-item d-flex justify-content-center">
                      <Button
                        className="btn btn_primary btn_services"
                        type="submit"
                        variant="contained"
                      >
                        Submit
                      </Button>
                    </div>
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

export default AddSlot;
