import React, { useEffect, useRef, useState } from "react";
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
import { LoginFields } from "./Reset-password-list-data-map";
import { createStyles, makeStyles } from "@mui/styles";
import FieldsGrid from "src/common/fields-grid/fields-grid";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { errorToast, successToast } from "src/utils/toaster";
import { useNavigate, useParams } from "react-router";
import { responseAndError } from "../../../../utils/variables";
import { verifyToken } from "src/hook/query/login";
import { ChangeResetPassword } from "src/hook/query/createUser";

const { passwordAndConfirmPasswordIsNotMatched, somethingWentWrong } =
  responseAndError;

function ResetPassword() {
  const navigate = useNavigate();
  const [fieldsMap] = useState(LoginFields);
  const newUserRef = useRef({} as any);
  const classes = useStyles();
  const params = useParams();
  const modifiedToken = params.token.replace(/_dev_/g, ".");
  const [email, setEmail] = useState("");
  const { error, data, loading } = useQuery(verifyToken, {
    variables: {
      token: modifiedToken,
    },
  });

  useEffect(() => {
    if (error) {
      navigate(`/login`);
      return errorToast("Token is expired");
    }
    setEmail(data?.verifyToken?.email);
  }, [error, data]);

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

  const [userMutation] = useMutation(ChangeResetPassword);
  const adduser = async () => {
    if (!(newUserRef.current.password === newUserRef.current.confirmPassword)) {
      return errorToast(passwordAndConfirmPasswordIsNotMatched);
    } else {
      try {
        const result = await userMutation({
          variables: {
            email: email,
            password: newUserRef.current.password,
          },
        });

        if (result.data) {
          successToast("Password updated");
          navigate("/login");
        }
      } catch (error: any) {
        errorToast(`Your token time is expired`);
      }
    }
  };

  function renderActions() {
    return (
      <div className={classes.actionsContainer}>
        <Button type="submit" color="success" variant="contained">
          Submit
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
              <CardHeader title="Reset password" />
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

export default ResetPassword;
