import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useQuery } from "@apollo/client";
import { footerQuery } from "src/hook/query/footer";
import SlotList from "../internal-component/manage-calendar/Transactions";

const ManageCalendar = () => {
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
        <title>Manage Calendar</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Slots"
          docs="/auth/calendar/addSlot"
          secondHeading="Add Slot"
        />
      </PageTitleWrapper>
      <SlotList />
    </>
  );
};

export default ManageCalendar;