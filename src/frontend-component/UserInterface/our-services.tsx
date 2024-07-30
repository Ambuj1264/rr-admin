import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import ImageUploadCard from "../internal-component/services/imageUploadCard";
import FileListing from "../internal-component/services/FileListing";

const OurServices = () => {
  return (
    <>
      <Helmet>
        <title>Services</title>
      </Helmet>
      <PageTitleWrapper >
        <PageTitle
          heading="Services"
          docs="/auth/addServices"
         secondHeading="Add Service"
        />
       
      </PageTitleWrapper>
      <FileListing />
    
    </>
  );
};

export default OurServices;
