import React from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import ReservationListing from "../internal-component/Reservation/Transactions";

const Reservation = () => {
  return (
    <>
      <Helmet>
        <title>Reservations</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading="Reservations" />
      </PageTitleWrapper>
      <ReservationListing />
    </>
  );
};

export default Reservation;
