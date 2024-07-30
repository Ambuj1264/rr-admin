import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper"
import ReservationFormList from "../internal-component/ReservationForm/Transactions";

export const ReservationComponent = () => {


  return (
    <>
      <Helmet>
        <title>Reservation Form</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Reservation Form"
          docs="/auth/reservationForm/addReservationForm"
          secondHeading="Add Reservation Form"
        />
      </PageTitleWrapper>
      <ReservationFormList />
    </>
  );
};
