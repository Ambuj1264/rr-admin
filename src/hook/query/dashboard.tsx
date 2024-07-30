import { gql } from '@apollo/client';

export const dashBoardQuery= gql`

query Dashboard {
  dashboard {
    totalReservations
    percentageDifference
    totals
  }
}

`