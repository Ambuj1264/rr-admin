import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper"

import PackagesListing from "../internal-component/Manage-packages/Packages/Transactions";

const PackagesComponent = () => {


  return (
    <>
      <Helmet>
        <title>Packages</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Packages"
          docs="/auth/packages/addPackages"
          secondHeading="Add Package"
        />
      </PageTitleWrapper>
      <PackagesListing />
    </>
  );
};

export default PackagesComponent;