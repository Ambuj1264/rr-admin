import React, { useState, ChangeEvent, useEffect } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField"; // Import TextField
import { createStyles, makeStyles } from "@mui/styles";
import { errorToast, successToast } from "src/utils/toaster";
import axios from "axios";
import { BASE_URL_FOR_RESTAPI } from "src/envirement";
import serviceNameImage from "../../../Asset/serviceName.png";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageTitle from "src/components/PageTitle";
import { Switch } from "@mui/material";
import { useQuery } from "@apollo/client";
import {
  checkHighPriorityQuery,
  findServiceQuery,
  servicesListingQuery,
} from "src/hook/query/services";
import { useFormik } from "formik";
import { SUPPORTED_FORMATS, editServiceValidation, serviceValidation } from "src/utils/validation";
import { useNavigate, useParams } from "react-router";

const label = { inputProps: { "aria-label": "Switch demo" } };

interface ImageUploadCardProps {
  cardName?: string;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({ cardName }) => {
  const authKey= localStorage.getItem("TOKEN")
  const classes = useStyles();
  const params = useParams();
  const [imageUploaded, setImageUploaded] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(
    ""
  );
  const navigate = useNavigate();
  const [api, setApi] = useState<any>();
  const [fileData, setFileData] = useState<any>();
  const { data: apiData ,refetch: apiRefetch} = useQuery(findServiceQuery, {
    variables: {
      findServiceId: params?.id,
    },
      context:{
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      }
    
  });

  const { loading, data: checkData } = useQuery(checkHighPriorityQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const { loading: serviceListing, refetch: serviceRefetch } =
    useQuery(servicesListingQuery,{
      context:{
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      }
    });

  useEffect(() => {
    if (apiData && apiData.FindService) {
      // Set the initial form values when the data is available
      formik.setValues({
        serviceName: apiData.FindService.serviceName || "",
        serviceDescription: apiData.FindService.serviceDescription || "",
        priority: apiData.FindService.priority || false,
        image: [],
      });
    }
  }, [apiData]);
  const {  data, refetch } = useQuery(checkHighPriorityQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const handleUploadClick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") &&  SUPPORTED_FORMATS.includes(file.type)) {
        if (file.size <= 2 * 1024 * 1024) {
          setFileData(file);

          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedFile(reader.result);
            setImageUploaded(imageUploaded + 1);
          };
          reader.readAsDataURL(file);
          formik.setFieldValue("image", file);
        } else {
          errorToast("Image size should not be greater than 2Mb");
        }
      } else {
        errorToast("Only jpeg, jpg, png, and svg image types are allowed");
      }
    }
  };

  const priorityFucntion = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkHighPriority = data?.CheckPriority >= 5;  
    refetch();
    if(apiData?.FindService?.priority==true){
      return formik.setFieldValue("priority", e.target.checked);
    }
    if (checkHighPriority && e.target.checked === true) {
            return errorToast("Top Five is already set");
          }
        
          formik.setFieldValue("priority", e.target.checked);
  };

  const add = !loading && apiData?.FindService;

  const formik = useFormik({
    initialValues: {
      serviceName: "",
      serviceDescription: "",
      priority: false,
      image: [],
    },
    validationSchema: editServiceValidation,
    onSubmit: async (values, action) => {
      try {
        if (!values.image) {
          errorToast("Please provide an image");
          return;
        }

        const formdata: any = new FormData();
        formdata.append("id", params?.id);
        formdata.append("serviceName", values.serviceName);
        formdata.append("serviceDescription", values.serviceDescription);
        formdata.append("priority", values.priority);

        if (values.image) {
          formdata.append("image", values.image);
        }

        const response = await axios.post(
          `${BASE_URL_FOR_RESTAPI}/serviceUpdate`,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 202) {
          return errorToast("Service already exist");
        }
        if (response.data) {
          successToast("Service details updated successfully");
          serviceRefetch();
          action.resetForm();
          setSelectedFile("");
          apiRefetch()
          refetch()
          navigate("/auth/our-services");
        }
      } catch (error) {
        errorToast("Something went wrong");
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Edit service</title>
      </Helmet>{" "}
      <PageTitleWrapper>
        <PageTitle heading="Edit service" />
      </PageTitleWrapper>
      <Grid item xs={12}>
        <Card className={classes.cardContainer}>
          <form action="" onSubmit={formik.handleSubmit}>
            <Grid
              container
              sx={{
                justifyContent: "space-evenly",
                alignItems: "center",
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              <Grid
                item
                sx={{ mb: 2, my: 2, display: "flex", flexDirection: "column" }}
              >
                <TextField
                  placeholder="Enter the service name"
                  variant="outlined"
                  label="Service name"
                  name="serviceName"
                  value={formik.values.serviceName}
                  onChange={formik.handleChange}
                  disabled
                  sx={{ width: "400px" }}
                />
                {formik.errors.serviceName && formik.touched.serviceName && (
                  <span
                    className="form-error"
                    style={{ paddingLeft: "10px", color: "red" }}
                  >
                    {formik.errors.serviceName}
                  </span>
                )}
                <br />
                <TextField
                  placeholder="Enter the service description"
                  variant="outlined"
                  label="Service description"
                  name="serviceDescription"
                  value={formik.values.serviceDescription}
                  onChange={formik.handleChange}
                  sx={{ width: "400px" }}
                />
                {formik.errors.serviceDescription &&
                formik.touched.serviceDescription ? (
                  <span
                    className="form-error"
                    style={{ paddingLeft: "10px", color: "red" }}
                  >
                    {formik.errors.serviceDescription}
                  </span>
                ) : null}
                <Grid item xs={12}>
                  <br />
                  <label htmlFor="" style={{ paddingRight: "20px" }}>
                    <strong>Top Five </strong>
                  </label>
                  <Switch
                    {...label}
                    name="priority"
                    value={formik.values.priority}
                    onChange={priorityFucntion}
                    checked={formik.values.priority}
                  />
                </Grid>
              </Grid>
              <Card className={cardName}>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item sx={{ width: "175px", height: "99px" }}>
                    {formik.values.image.length !== 0 && (
                      <img
                        width="100%"
                        className={classes.img}
                        src={URL.createObjectURL(formik.values.image as any)}
                        alt="Upload"
                      />
                    )}
                    {formik.values.image.length === 0 && (
                      <img
                        width="100%"
                        className={classes.img}
                        src={
                          selectedFile
                            ? (selectedFile as string)
                            : `${BASE_URL_FOR_RESTAPI}/upload/${apiData?.FindService?.serviceImageName}`
                        }
                        alt="Upload"
                      />
                    )}
                  </Grid>
                  <label htmlFor="contained-button-file">
                    <input
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                      name="image"
                      onChange={handleUploadClick}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      sx={{ width: "50px", height: "20px", my: 1 }}
                    >
                      Select
                    </Button>
                  </label>
                </Grid>
                {formik.errors.image && formik.touched.image ? (
                  <span
                    className="form-error"
                    style={{
                      paddingLeft: "10px",
                      color: "red",
                      position: "absolute",
                      fontSize: "13px",
                    }}
                  >
                    {formik.errors.image}
                  </span>
                ) : null}
              </Card>
            </Grid>
            <Grid
              container
              sx={{ my: 2, alignItems: "center", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                type="submit"
                color="success"
                size="large"
                sx={{ width: "200px" }}
              >
                Submit
              </Button>
            </Grid>
          </form>
        </Card>
      </Grid>
    </>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    actionsContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "1rem",
    },
    cardContainer: {
      border: "0 0.5px 0 0.5px solid #f0f0f0",
      boxShadow: "none",
    },
    forgetPasswod: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1rem",
    },
    root: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      display: "none",
    },
    img: {
      width: 500,
      height: 200,
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
    pair: {
      display: "flex",
      flexDirection: "column",
    },
  })
);
const style = {
  my: 0.0,
};
export default ImageUploadCard;
