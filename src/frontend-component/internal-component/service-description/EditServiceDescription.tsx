
import React, {  useRef, useState } from "react";
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
import { createStyles, makeStyles } from "@mui/styles";
import FieldsGrid from "src/common/fields-grid/fields-grid";
import { errorToast, successToast } from "src/utils/toaster";
import { useNavigate } from "react-router";
import { responseAndError } from "src/utils/variables";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useMutation, useQuery } from "@apollo/client";
import { serviceDescription } from "src/hook/mutations/service-description";
import { ServiceDesciptionModule } from "src/hook/query/service-description";
import { servicesFieldDescription } from "./serviceDescriptionMap";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageTitle from "src/components/PageTitle";

const {somethingWentWrong} = responseAndError;
const EditServicesDescription = () => {
  const authKey= localStorage.getItem("TOKEN")
  const [fieldsMap] = useState(servicesFieldDescription);
  const newUserRef = useRef({} as any);
  const classes = useStyles();
  const {loading:queryLoading,error:queryError, data, refetch}= useQuery(ServiceDesciptionModule,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  }
  // {fetchPolicy:"network-only"}
  )
  const [serviceDescriptionMutation, { loading }] = useMutation(serviceDescription,{onCompleted:refetch});
  const navigate= useNavigate();

  if (loading ||queryLoading ) {
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
 

  const addServices = async () => {
    try {
      const result = await serviceDescriptionMutation({
        variables: {
          input: {
            serviceName:newUserRef.current.serviceName ,
            serviceSubheading: newUserRef.current.serviceSubheading,
            serviceDescription: newUserRef.current.serviceDescription,
            serviceButton: newUserRef.current.serviceButton,
          },
        },
          context:{
            headers: {
              Authorization: `Bearer ${authKey}`,
            },
          
        }
      });

      if (result.data) {
          refetch();
          successToast("Your home page brief has been updated successfully");
        navigate("/auth/serviceDescriptionListing")
        
      }
    } catch (error: any) {
      errorToast(somethingWentWrong);
    }
  };
  function renderActions() {
    return (
      <>
      <div className={classes.actionsContainer}>
        
        {data?.serviceDesciptionModule ?<Button type="submit" color="success" variant="contained"> Update</Button> :<Button type="submit" color="success" variant="contained"> Submit</Button>}
       
      </div>
      </>
    );
  }
  return (
    <>
         <Helmet>
        <title>Edit service description </title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Edit Home Page Brief" />
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
              <CardHeader title="Brief" />
              <Divider />
              <CardContent>
                <ValidatorForm onSubmit={addServices} onError={() => {}}>
                  <FieldsGrid
                    fieldsMap={servicesFieldDescription}
                    mode="create"
                    data={ {"serviceName":data?.serviceDesciptionModule?.serviceName, "serviceSubheading":data?.serviceDesciptionModule?.serviceSubheading, "serviceDescription":data?.serviceDesciptionModule?.serviceDescription,"serviceButton": data?.serviceDesciptionModule?.serviceButton}}
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
  )
}
export default EditServicesDescription
const useStyles = makeStyles(() =>
  createStyles({
    actionsContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "1rem",
    },
    sideButton: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1rem",
    },
    cardContainer: {
      border: "0.5px solid #f0f0f0",
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

