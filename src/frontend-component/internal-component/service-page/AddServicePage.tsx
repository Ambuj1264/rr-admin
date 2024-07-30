import React, { useState, ChangeEvent } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField"; // Import TextField
import { createStyles, makeStyles } from "@mui/styles";
import { errorToast, successToast } from "src/utils/toaster";
import axios from "axios";
import { BASE_URL_FOR_RESTAPI } from "src/envirement";
import serviceBannerImage from "../../../Asset/serviceBanner.png";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageTitle from "src/components/PageTitle";
import { useQuery } from "@apollo/client";
import { servicePageDetails } from "src/hook/query/services";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useNavigate } from "react-router";
import { SUPPORTED_FORMATS } from "src/utils/validation";
const label = { inputProps: { "aria-label": "Switch demo" } };
interface ImageUploadCardProps {
  cardName?: string;
}

const AddServicePage: React.FC<ImageUploadCardProps> = ({ cardName }) => {
  const authKey= localStorage.getItem("TOKEN")
  const classes = useStyles();
  const [imageUploaded, setImageUploaded] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(
    ""
  );
  const [inputValue, setInputValue] = useState("");
  const [fileData, setFileData] = useState<any>();
  const navigate = useNavigate();
  const {
    loading: serviceListing,
    refetch: serviceRefetch,
    data,
  } = useQuery(servicePageDetails,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  if (serviceListing) {
    return <SuspenseLoader />;
  }
  const handleUploadClick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") &&   SUPPORTED_FORMATS.includes(file.type)) {
        if (file.size <= 2.5 * 1024 * 1024) {
          setFileData(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedFile(reader.result);
            setImageUploaded(imageUploaded + 1);
          };
          reader.readAsDataURL(file);
        } else {
          
          errorToast("Image size should not be greater than 2Mb");
        }
      } else {
        errorToast("Only jpeg, jpg, png, and svg image types are allowed");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if(!inputValue || !fileData){
        return errorToast("Please provide both service description and service's banner")
       }
       if(inputValue.length>=500){
           return errorToast("Only 500 characters are allowed")
       }
      const formdata: any = new FormData();
      formdata.append("serviceDescription", inputValue);

      if (fileData) {
        formdata.append("serviceBanner", fileData);
      }
      const response = await axios.post(
        `${BASE_URL_FOR_RESTAPI}/servicePageUpload`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        successToast("Submitted");
        serviceRefetch();
        setInputValue("");
        setSelectedFile("");
        navigate("/auth/service-page");
      }
    } catch (error) {
      errorToast("Something went wrong");
    }
  };
  const spacehandler = (event) => {
    if (event.which === 32 && event.target.value === "") {
      event.preventDefault();
    }
  };
  return (
    <>
      <Helmet>
        <title>Add service page</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Add service page" />
      </PageTitleWrapper>
      <Grid item xs={12}>
        <Card className={classes.cardContainer}>
          <Grid
            container
            sx={{
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              flexDirection: "column",
            }}
          >
            <Card className={cardName} sx={{ my: 2, mb: 2 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item sx={{ width: "175px", height: "99px" }}>
                  <img
                    width="100%"
                    className={classes.img}
                    src={
                      selectedFile
                        ? (selectedFile as string)
                        : serviceBannerImage
                    }
                    alt="Uploaded"
                  />
                </Grid>
                <label htmlFor="contained-button-file">
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={handleUploadClick}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    sx={{ width: "50px", height: "20px", my: 1 }}
                  >
                    Upload
                  </Button>
                </label>
              </Grid>
            </Card>
            <TextField
              placeholder="Enter the service description"
              variant="outlined"
              label="Service description"
              name="serviceDescription"
              value={inputValue}
              onKeyDown={spacehandler}
              onChange={(e) => setInputValue(e.target.value)}
              sx={{
                width: "300px",
              }}
            />
          </Grid>
          <Grid
            container
            sx={{ my: 2, alignItems: "center", justifyContent: "center" }}
          >
            {data.servicePageDataListing.length ? (
              ""
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                color="success"
                size="small"
              >
                Submit
              </Button>
            )}
          </Grid>
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
export default AddServicePage;
