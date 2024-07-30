import  { gql } from '@apollo/client';

export const resourceFormQuery = gql`
query ReservationFormAllData {
  reservationFormAllData {
    id
    serviceName
    serviceId
    fields
  }
}
`

export const resourceFormSingleData =gql`
query ReservationFormAllData($reservationFormSingleDataId: String!) {
  reservationFormSingleData(id: $reservationFormSingleDataId) {
    id
    serviceName
    serviceId
    fields
  }
}
`


