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
import { addUserFields } from "./user-list-data-map";
import { createStyles, makeStyles } from "@mui/styles";
import FieldsGrid from "src/common/fields-grid/fields-grid";
import { createUserMutation } from "../../../../hook/query/createUser";
import { useLazyQuery, useMutation } from "@apollo/client";
import { errorToast, successToast } from "src/utils/toaster";
import { useNavigate } from "react-router";
import SuspenseLoader from "src/components/SuspenseLoader";
function AddRegistration() {
  const navigate=useNavigate();
  const [fieldsMap] = useState(addUserFields);
  const newUserRef = useRef({} as any);
  const classes = useStyles();
  const [userMutation,{loading}] = useMutation(createUserMutation);
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
  if (loading) {
    return <SuspenseLoader />
  }

  const adduser = async () => {
    try {
      const result = await userMutation({
        variables:{input: {
          email: newUserRef.current.email,
          password: newUserRef.current.password,
          mobileNumber: newUserRef.current.phone,
          firstName: newUserRef.current.firstName,
          lastName: newUserRef.current.lastName
        }},
      });

      if (result.data) {
        successToast("Registration successful");
        navigate("/login");
      } 
      
    } catch (error: any) {
      errorToast(error.message);
    }

  };


  function renderActions() {
    return (
      <div className={classes.actionsContainer}>
        
        <Button type="submit" color="success" variant="contained">
        Sign Up
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
              <CardHeader title="Register" />
              <Divider />
              <CardContent>
                <ValidatorForm onSubmit={adduser} onError={() => {}}>
                  <FieldsGrid 
                  //  sx={style}
                    fieldsMap={addUserFields}
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
    
  })
);
const style={
  my:0.0,
}
export default AddRegistration;
