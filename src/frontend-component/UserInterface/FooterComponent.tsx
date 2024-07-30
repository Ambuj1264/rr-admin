import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useQuery } from "@apollo/client";
import { footerQuery } from "src/hook/query/footer";
import FooterIndex from "../internal-component/Footer/Transactions";

const FooterComponent = () => {
  const authKey= localStorage.getItem("TOKEN")
  const { loading, data } = useQuery(footerQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });

  if (loading) {
    return <SuspenseLoader />;
  }

  const shouldShowDocs = data?.footerData?.footerLogo;
  return (
    <>
      <Helmet>
        <title>Footer</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Footer"
          docs={shouldShowDocs?"":"/auth/addFooter"}
          secondHeading={shouldShowDocs?"":"Add footer"}
        />
      </PageTitleWrapper>
      <FooterIndex />
    </>
  );
};

export default FooterComponent;