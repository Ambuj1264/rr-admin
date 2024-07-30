import React, { Suspense, useEffect, useRef, useState } from "react";
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
import { LoginFields } from "./login-list-data-map";
import { createStyles, makeStyles } from "@mui/styles";
import FieldsGrid from "src/common/fields-grid/fields-grid";
import { loginQuery } from "../../../hook/query/login";
import { useLazyQuery } from "@apollo/client";
import { errorToast, successToast } from "src/utils/toaster";
import { useNavigate } from "react-router";
import { responseAndError } from "src/utils/variables";
import SuspenseLoader from "src/components/SuspenseLoader";

const { emailAndPasswordNotMacthed,loginSuccessful } = responseAndError;
function AddLogin() {
  const navigate = useNavigate();
  const [fieldsMap] = useState(LoginFields);
  const newUserRef = useRef({} as any);
  const classes = useStyles();
  const [login, { loading }] = useLazyQuery(loginQuery, {
    onCompleted: (data) => {
      localStorage.setItem("TOKEN", data?.login?.token?.token);
      localStorage.setItem("USERNAME",JSON.stringify({firstName: data?.login?.info?.firstName, lastName: data?.login?.info?.lastName}))
      successToast(loginSuccessful);
      navigate("/");
    },
  });
  if (loading) {
    return <SuspenseLoader />
  }

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

  const adduser = async () => {
    const result = await login({
      variables: {
        email: newUserRef?.current?.email,
        password: newUserRef?.current?.password,
      },
    });
    if (!result.data) {
      errorToast(emailAndPasswordNotMacthed);
    }
  };
  function renderActions() {
    return (
      <div>
        <div className={classes.actionsContainer}>
          <Button type="submit" color="success" variant="contained">
            Login
          </Button>
        </div>
        <div className={classes.forgetPasswod}>
          <Button type="button" onClick={()=>navigate("/forget-password")}>Forgot password</Button>
        </div>
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
              <CardHeader title="Login" />
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
      border: "0.5px solid #f0f0f0",
      boxShadow: "none",
    },
    forgetPasswod:{
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1rem",
    }
  })
);
const style = {
  my: 0.0,
};
export default AddLogin;
