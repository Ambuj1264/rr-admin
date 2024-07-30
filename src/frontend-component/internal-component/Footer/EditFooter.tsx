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
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { createStyles, makeStyles } from "@mui/styles";
import FieldsGrid from "src/common/fields-grid/fields-grid";
import { errorToast, successToast } from "src/utils/toaster";
import SuspenseLoader from "src/components/SuspenseLoader";
import { footerFields } from "./footer-list-data-map";
import { useMutation, useQuery } from "@apollo/client";
import { footerQuery } from "src/hook/query/footer";
import { updateFooterMutation } from "src/hook/mutations/createFooter";
import { useNavigate } from "react-router";

function EditFooter() {
  const authKey= localStorage.getItem("TOKEN")
  const [fieldsMap] = useState(footerFields);
  const newUserRef = useRef({} as any);
  const classes = useStyles();
  const {loading:queryLoading, data, refetch}=useQuery(footerQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })
  const [footerMutation, { loading }] = useMutation(updateFooterMutation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const navigate= useNavigate();

  if (loading || queryLoading) {
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

  const addFooter = async () => {
    try {
      const result = await footerMutation({
        variables: {
          input: {
            id: data?.footerData?.id,
            footerLogo: newUserRef.current.footerLogo,
            footerDescription: newUserRef.current.footerDescription,
            facebook: newUserRef.current.facebook,
            twitter: newUserRef.current.twitter,
            instagram: newUserRef.current.instagram,
            linkedin: newUserRef.current.linkedin,
          },
        },
      });

      if (result.data) {
        refetch();
        successToast("Footer updated successfully");
        navigate("/auth/footer")

      }
    } catch (error: any) {
      errorToast(error.message);
    }
  };
  function renderActions() {
    return (
      <div className={classes.actionsContainer}>
        <Button type="submit" color="success" variant="contained">
         {data?.footerData? "Update":"Submit"} 
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Footer</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Footer"
        />
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
              <CardHeader title="Footer" />
              <Divider />
              <CardContent>
                <ValidatorForm onSubmit={addFooter} onError={() => {}}>
                  <FieldsGrid
                    fieldsMap={footerFields}
                    data={{
                      "footerLogo":data?.footerData?.footerLogo,
                      "footerDescription":data?.footerData?.footerDescription,
                      facebook:data?.footerData?.socialMedia[0]?.facebook,
                      twitter:data?.footerData?.socialMedia[0]?.twitter,
                      instagram:data?.footerData?.socialMedia[0]?.instagram,
                      linkedin:data?.footerData?.socialMedia[0]?.linkedin
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
export default EditFooter;
