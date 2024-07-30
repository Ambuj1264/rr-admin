import React, { useRef, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import { LoginFields } from "./forget-password-list-data-map";
import { createStyles, makeStyles } from "@mui/styles";
import FieldsGrid from "src/common/fields-grid/fields-grid";
import { useMutation } from "@apollo/client";
import { errorToast, successToast } from "src/utils/toaster";
import { useNavigate } from "react-router";
import { forgetPasswordMutation } from "src/hook/query/createUser";
import SuspenseLoader from "src/components/SuspenseLoader";
function ForgetPassword() {
  const navigate = useNavigate();
  const [fieldsMap] = useState(LoginFields);
  const newUserRef = useRef({} as any);
  const classes = useStyles();
  const [forgetMutation, { loading}] = useMutation(forgetPasswordMutation);
  function onFieldChange({ id, value }: { id: string; value: any }) {


    const fieldMap = fieldsMap.find((f) => f.fields.includes(id));
    if (fieldMap) {
      const apiKey = fieldMap.apiKey || id;
      if (value?.id !== undefined) {
        newUserRef.current[apiKey] = value.id;
      } else {
        newUserRef.current[apiKey] = value;
      }
    } else {
      newUserRef.current[id] = value;
    }
  }
  if(loading){
    return <SuspenseLoader />
  }
  const adduser = async () => {
   try{
      const result = await forgetMutation({
        variables: {
          input: {
            email: newUserRef.current.email,
          },
        },
      });
      if (result.data) {
        successToast("Please check your entered email address to change your password");
        navigate("/login");
      }
   }
   catch(error){
    errorToast(error.message)
   }
  };
  function renderActions() {
    return (
        <div className={classes.actionsContainer}>
          <Button type="submit" color="success" variant="contained">
            Send Mail
          </Button>
        </div>
    );
  }
  return (
    <>
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
              <CardHeader title="Forgot password" />
              <Divider />
              <CardContent>
                <ValidatorForm onSubmit={adduser} onError={() => {}}>
                  <FieldsGrid
                    //  sx={style}
                    fieldsMap={LoginFields}
                    mode="create"
                    disabled={false}
                    onChange={onFieldChange}
                  />
                  {renderActions()}
                </ValidatorForm>
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
      border: "0.5px solid #F0F0F0",
      boxShadow: "none",
    },
    forgetPasswod: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1rem",
    },
  })
);
const style = {
  my: 0.0,
};
export default ForgetPassword;