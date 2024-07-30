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
import { PackagesEditFields } from "./edit-list-data-map";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router";
import {
  productItemsListingQuery,
  productItemsQuery,
} from "src/hook/query/item";
import { servicesListingQuery } from "src/hook/query/services";
import { updatePackageMutation } from "src/hook/mutations/prakages";
import {
  packageSingleQuery,
  packagesQueryListing,
} from "src/hook/query/packages";

function EditPackages() {
  const authKey= localStorage.getItem("TOKEN")
  const [fieldsMap] = useState(PackagesEditFields);
  const newUserRef = useRef({} as any);
  const classes = useStyles();
  const {
    loading: queryLoading,
    data,
    refetch,
  } = useQuery(productItemsListingQuery, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });
  const [updateItemsMutate, { loading }] = useMutation(updatePackageMutation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const {
    loading: ServiceLoadings,
    data: ServiceDatas,
    refetch: serviceRefetchs,
  } = useQuery(productItemsListingQuery, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });
  const {
    loading: ServiceLoading,
    data: ServiceData,
    refetch: serviceRefetch,
  } = useQuery(servicesListingQuery, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });
  const { loading: packageLoad, refetch: packageQuery } = useQuery(
    packagesQueryListing,
    {
      context: {
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      },
    }
  );

  const navigate = useNavigate();
  const params = useParams();
  const {
    loading: productItemLoader,
    data: productItemData,
    refetch: productItemRefetch,
  } = useQuery(packageSingleQuery, {
    variables: {
      packageSingleDataId: params?.id,
    },
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });
  if (
    loading ||
    queryLoading ||
    productItemLoader ||
    ServiceLoading ||
    packageLoad ||
    ServiceLoadings
  ) {
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
  // Create a mapping object from apiData using serviceName as keys
  const apiDataMap = {};

  ServiceData?.serviceListing.forEach((item) => {
    apiDataMap[item.serviceName] = item;
  });

  // Update the fieldsMap for the item with apiKey "service"
  fieldsMap.forEach((field) => {
    if (field.apiKey === "service") {
      // Add options from apiData
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
      // Add options from apiData
      field.options = data?.productItemsListing?.map((item) => ({
        id: item.id,
        value: item?.itemName,
      }));
    }
  });
  console.log( newUserRef?.current?.basic ,  newUserRef?.current?.deluxe, newUserRef?.current?.superDeluxe)
  const updateItems = async () => {
    try {
      if (
        (
          newUserRef?.current?.basic ===false &&
          newUserRef?.current?.deluxe ===false &&
          newUserRef?.current?.superDeluxe ===false
        )
      ) {
        return errorToast(
          "Please select at least one of Basic, Deluxe or Super Deluxe package"
        );
      }
      const result = await updateItemsMutate({
        variables: {
          input: {
            id: params?.id,
            service: newUserRef?.current?.service,
            items: newUserRef?.current?.items,
            basic: newUserRef?.current?.basic,
            superDeluxe: newUserRef?.current?.superDeluxe,
            deluxe: newUserRef.current?.deluxe,
            basicPackagePrice: newUserRef?.current?.basicPackagePrice,
            deluxePackagePrice: newUserRef?.current?.deluxePackagePrice,
            superDeluxePackagePrice:
              newUserRef?.current?.superDeluxePackagePrice,
          },
        },
      });

      if (result.data) {
        productItemRefetch();
        successToast("Your package has been updated successfully");
        serviceRefetchs();
        packageQuery();
        navigate("/auth/packages/PackagesListing");
      }
    } catch (error: any) {
      errorToast(error.message);
    }
  };
  function renderActions() {
    return (
      <div className={classes.actionsContainer}>
        <Button type="submit" color="success" variant="contained">
          {data?.footerData ? "Update" : "Submit"}
        </Button>
      </div>
    );
  }
  console.log(
    productItemData?.packageSingleData,
    " productItemData?.packageSingleData?.services_id"
  );
  const selectData = {
    id: productItemData?.packageSingleData?.services_id,
    value: productItemData?.packageSingleData?.services_serviceName,
  };
  return (
    <>
      <Helmet>
        <title>Edit Package</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Edit Package" />
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
                <ValidatorForm onSubmit={updateItems} onError={() => {}}>
                  <FieldsGrid
                    fieldsMap={PackagesEditFields}
                    mode="create"
                    data={{
                      service: selectData,
                      items: productItemData?.packageSingleData?.packages_items,
                      basic: productItemData?.packageSingleData?.packages_basic,
                      deluxe:
                        productItemData?.packageSingleData?.packages_deluxe,
                      superDeluxe:
                        productItemData?.packageSingleData
                          ?.packages_superDeluxe,
                      basicPackagePrice:
                        productItemData?.packageSingleData
                          ?.packages_basicPackagePrice,
                      deluxePackagePrice:
                        productItemData?.packageSingleData
                          ?.packages_deluxePackagePrice,
                      superDeluxePackagePrice:
                        productItemData?.packageSingleData
                          ?.packages_superDeluxePackagePrice,
                    }}
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
export default EditPackages;
