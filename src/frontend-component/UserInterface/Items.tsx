import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useQuery } from "@apollo/client";
import { footerQuery } from "src/hook/query/footer";
import ProductItemListing from "../internal-component/Manage-packages/Items/Transactions";

const ItemComponent = () => {
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


  return (
    <>
      <Helmet>
        <title>Items</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Items"
          docs="/auth/packages/addItem"
          secondHeading="Add Item"
        />
      </PageTitleWrapper>
      <ProductItemListing />
    </>
  );
};

export default ItemComponent;