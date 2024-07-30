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
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { createStyles, makeStyles } from "@mui/styles";
import FieldsGrid from "src/common/fields-grid/fields-grid";
import { errorToast, successToast } from "src/utils/toaster";
import SuspenseLoader from "src/components/SuspenseLoader";
import { PackagesFields } from "./item-list-data-map";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { itemMutations } from "src/hook/mutations/item";
import { productItemsListingQuery } from "src/hook/query/item";
import { servicesListingQuery } from "src/hook/query/services";
import { packagesFeildMutation } from "src/hook/mutations/prakages";

function AddPackages() {
  const authKey= localStorage.getItem("TOKEN")
  const [fieldsMap] = useState(PackagesFields);
  const newUserRef = useRef({} as any);
  const classes = useStyles();
  const {
    loading: queryLoading,
    data,
    refetch,
  } = useQuery(productItemsListingQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const {
    loading: ServiceLoading,
    data: ServiceData,
    refetch: serviceRefetch,
  } = useQuery(servicesListingQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const [packagesMutate, { loading }] = useMutation(packagesFeildMutation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const navigate = useNavigate();
  if (loading || queryLoading || ServiceLoading) {
    return <SuspenseLoader />;
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

  const apiDataMap = {};
  ServiceData?.serviceListing.forEach((item) => {
    apiDataMap[item.serviceName] = item;
  });

  fieldsMap.forEach((field) => {
    if (field.apiKey === "service") {
      field.options = ServiceData?.serviceListing?.map((item) => ({
        id: item.id,
        value: item.serviceName,
      }));
    }
  });

  const productItemDataMap = {};
  data?.productItemsListing?.forEach((item) => {
    productItemDataMap[item?.itemName] = item;
  });

  fieldsMap.forEach((field) => {
    if (field.apiKey === "items") {
      field.options = data?.productItemsListing?.map((item) => ({
        id: item.id,
        value: item?.itemName,
      }));
      console.log(
        data?.productItemsListing[0]?.id,
        data?.productItemsListing[0]?.itemName
      );
    }
  });

  const addItem = async () => {
   
    try {
      if (!(newUserRef?.current?.basic ||newUserRef?.current?.deluxe || newUserRef?.current?.superDeluxe)) {
      return  errorToast(
          "Please select at least one of Basic, Deluxe or Super Deluxe package"
        );
      } 
      
      const result = await packagesMutate({
        variables: {
          input: {
            service: newUserRef?.current?.service,
            items: newUserRef?.current?.items,
            basic: newUserRef?.current?.basic,
            superDeluxe: newUserRef?.current?.superDeluxe,
            deluxe: newUserRef?.current?.deluxe,
            basicPackagePrice: newUserRef?.current?.basicPackagePrice,
            deluxePackagePrice: newUserRef?.current?.deluxePackagePrice,
            superDeluxePackagePrice:
              newUserRef?.current?.superDeluxePackagePrice,
          },
        },
      });

      if (result.data) {
        refetch();
        successToast("Your package has been added successfully");
        navigate("/auth/packages/PackagesListing");
      }
    } catch (error: any) {
      errorToast(error.message);
    }
  };
  function renderActions() {
    return (
      <>
        <div className={classes.actionsContainer}>
          <Button type="submit" color="success" variant="contained">
            Submit
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>Add Package</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Add Package" />
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
              <CardHeader title="Package" />
              <Divider />
              <CardContent>
                <ValidatorForm onSubmit={addItem} onError={() => {}}>
                  <FieldsGrid
                    fieldsMap={PackagesFields}
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
export default AddPackages;
