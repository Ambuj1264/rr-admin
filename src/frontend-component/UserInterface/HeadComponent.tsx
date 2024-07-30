import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import HeaderIndex from "../internal-component/header/Transactions";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useQuery } from "@apollo/client";
import { headerDataQuery } from "src/hook/query/header";

const HeadComponent = () => {
  const authKey= localStorage.getItem("TOKEN")
  const { loading, data } = useQuery(headerDataQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });

  if (loading) {
    return <SuspenseLoader />;
  }

  // Check if data.headerData exists and contains the imageName property
  const shouldShowDocs = data?.headerData?.imageName;
  return (
    <>
      <Helmet>
        <title>Header</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Logo"
          docs={shouldShowDocs?"":"/auth/addHeader"}
          secondHeading={shouldShowDocs?"":"Add logo"}
        />
      </PageTitleWrapper>
      <HeaderIndex />
    </>
  );
};

export default HeadComponent;
