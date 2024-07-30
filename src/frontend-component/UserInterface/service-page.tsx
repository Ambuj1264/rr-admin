import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useQuery } from "@apollo/client";
import ServicePageDescriptionIndex from "../internal-component/service-page/Transactions";
import { servicePageDetails } from "src/hook/query/services";

const ServicePageListing = () => {
  const authKey= localStorage.getItem("TOKEN")
  const { loading, data } = useQuery(servicePageDetails,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  if (loading) {
    return <SuspenseLoader />;
  }

  const shouldShowDocs = data?.servicePageDataListing?.length;
  return (
    <>
      <Helmet>
        <title>Services page</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Services page"
          docs={shouldShowDocs ? "" : "/auth/addService-page"}
          secondHeading={shouldShowDocs ? "" : "Add Service page"}
        />
      </PageTitleWrapper>
      <ServicePageDescriptionIndex />
    </>
  );
};

export default ServicePageListing;
