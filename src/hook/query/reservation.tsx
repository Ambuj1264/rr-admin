import { gql } from "@apollo/client";

export const getAllReservationQuery = gql`
  query GetAllReservation {
    getAllReservation {
      reservationForm
      serviceId
      serviceName
      packages
      packagePrice
      packageType
    }
  }
`;
