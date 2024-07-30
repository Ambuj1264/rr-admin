
import React, { useState, ChangeEvent, useEffect } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { createStyles, makeStyles } from "@mui/styles";
import { errorToast, successToast } from "src/utils/toaster";
import axios from "axios";
import { BASE_URL_FOR_RESTAPI } from "src/envirement";
import { useQuery } from "@apollo/client";
import { headerDataQuery } from "src/hook/query/header";
import SuspenseLoader from "src/components/SuspenseLoader";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageTitle from "src/components/PageTitle";
import { useNavigate } from "react-router";
import { SUPPORTED_FORMATS, logoEditValidation } from "src/utils/validation";
import { useFormik } from "formik";
interface ImageUploadCardProps {
  cardName?: string;
}

const EditHeader: React.FC<ImageUploadCardProps> = ({ cardName }) => {
  const authKey= localStorage.getItem("TOKEN")
  const classes = useStyles();

  const [imageUploaded, setImageUploaded] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>("");
  const [inputValue, setInputValue] = useState("");
  const [fileData, setFileData] = useState<any>();
  const { loading, data, refetch } = useQuery(headerDataQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const [apiData, setApiData] = useState(data);
  const navigate = useNavigate();

  useEffect(() => {
    setApiData(data?.headerData?.altName);
  }, [data]);

  const handleUploadClick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") && SUPPORTED_FORMATS.includes(file.type)) {
        if (file.size <= 2.5 * 1024 * 1024) {
          setFileData(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedFile(reader.result);
            setImageUploaded(imageUploaded + 1);
          };
          reader.readAsDataURL(file);
          setFieldValue("image", file)
        } else {
          errorToast("Image size should not be greater than 2Mb");

        }
      } else {
        errorToast("Only jpeg, jpg, png, and svg image types are allowed");
      }
    }
  };

  const { values, touched, errors,handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      image: data?.headerData?.imageName,
    },
    // validationSchema: logoEditValidation,
    onSubmit: async (values, action) => {
      try {
        // if (!fileData) {
        //   errorToast("Please select a logo to upload");
        //   return;
        // }
        const formdata = new FormData();
        if (fileData) {
          formdata.append("image", fileData);
        } else if (data?.headerData?.imageName) {
          // If no new file is selected, use the API data's image name
          formdata.append("image", data.headerData.imageName);
        }
        const response = await axios.post(
          `${BASE_URL_FOR_RESTAPI}/navbarUpload`,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data) {
          action.resetForm();
          successToast("Logo updated successfully");
          refetch();
          navigate("/auth/header");
        }
      } catch (error) {
        errorToast("Only jpeg, jpg, png, and svg image types are allowed");
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Edit logo</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Edit logo" />
      </PageTitleWrapper>
      <form action="" onSubmit={handleSubmit}>
        <Grid item xs={12}>
          <Card className={classes.cardContainer}>
            <div className={classes.root}>
              <Card className={cardName} sx={{ my: 5 }}>
                {data?.headerData ? (
                  <Grid container direction="column" alignItems="center" justifyContent="center">
                    <Grid item sx={{ width: "150px", height: "89px" }}>
                      <img
                        width="100%"
                        className={classes.img}
                        src={selectedFile ? (selectedFile as string) : `${BASE_URL_FOR_RESTAPI}/upload/${data?.headerData?.imageName}`}
                        alt=""
                      />
                    </Grid>
                    <label htmlFor="contained-button-file">
                      <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        name="image"
                        onChange={handleUploadClick}
                      />
                      <Button variant="contained" component="span" sx={{ width: "50px", height: "20px", my: 1 }}>
                        Select
                      </Button>
                    </label>
                  </Grid>
                ) : null}
              </Card>
            </div>
          </Card>
        </Grid>
        <Card className={classes.cardContainer}>
          <div className={classes.root}>
            <Grid item sx={{ mb: 4 }}>
              {data?.headerData ? (
                <Button variant="contained" type="submit" color="success" size="small">
                  Upload
                </Button>
              ) : null}
            </Grid>{" "}
          </div>
        </Card>
      </form>
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
    forgetPassword: {
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
  })
);

export default EditHeader;
