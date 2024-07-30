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
import { editItemFields } from "./edit-data-map";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router";
import { updateItemMuation } from "src/hook/mutations/item";
import {
  productItemsListingQuery,
  productItemsQuery,
} from "src/hook/query/item";

function EditItems() {
  const authKey= localStorage.getItem("TOKEN")
  const [fieldsMap] = useState(editItemFields);
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
  const [updateItemsMutate, { loading }] = useMutation(updateItemMuation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const navigate = useNavigate();
  const params = useParams();
  const {
    loading: productItemLoader,
    data: productItemData,
    refetch: productItemRefetch,
  } = useQuery(productItemsQuery, {
    variables: {
      findProductItemsId: params?.id,
    },
      context:{
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      
    }
  });
  if (loading || queryLoading || productItemLoader) {
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

  const updateItems = async () => {
    try {
      const result = await updateItemsMutate({
        variables: {
          input: {
            id: params?.id,
            basicQuantity: newUserRef.current?.basicQuantity
              ? newUserRef.current?.basicQuantity
              : productItemData?.findProductItems?.basicQuantity,
            deluxeQuantity: newUserRef?.current.deluxeQuantity,
            superDeluxeQuantity: newUserRef.current?.superDeluxeQuantity,
            itemName: newUserRef.current?.itemName,
          },
        },
      });

      if (result.data) {
        refetch();
        productItemRefetch();
        successToast("Item updated successfully");
        navigate("/auth/packages/ProductItemsListing");
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

  return (
    <>
      <Helmet>
        <title>Edit Item</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Edit Item" />
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
              <CardHeader title="Edit" />
              <Divider />
              <CardContent>
                <ValidatorForm onSubmit={updateItems} onError={() => {}}>
                  <FieldsGrid
                    fieldsMap={editItemFields}
                    data={{
                      basicQuantity:
                        productItemData?.findProductItems?.basicQuantity,
                      deluxeQuantity:
                        productItemData?.findProductItems?.deluxeQuantity,
                      superDeluxeQuantity:
                        productItemData?.findProductItems?.superDeluxeQuantity,
                      itemName: productItemData?.findProductItems?.itemName,
                    }}
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
export default EditItems;
