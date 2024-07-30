import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useQuery } from "@apollo/client";
import ServiceDescriptionIndex from "../internal-component/service-description/Transactions";
import { ServiceDesciptionModule } from "src/hook/query/service-description";

const ServiceDescriptionListing = () => {
  const authKey= localStorage.getItem("TOKEN")
  const { loading, data } = useQuery(ServiceDesciptionModule,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });

  if (loading) {
    return <SuspenseLoader />;
  }

  const shouldShowDocs = data?.serviceDesciptionModule?.serviceName;
  return (
    <>
      <Helmet>
        <title>Home Page Brief</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Home Page Brief"
          docs={shouldShowDocs?"":"/auth/addServiceDescription"}
          secondHeading={shouldShowDocs?"":"Add your brief"}
        />
      </PageTitleWrapper>
      <ServiceDescriptionIndex />
    </>
  );
};

export default ServiceDescriptionListing;