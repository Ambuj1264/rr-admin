import { gql } from "@apollo/client";

export const reservationFormMutation = gql`
mutation CreateRerservationForm($input: reservationFormInput) {
  createRerservationForm(input: $input) {
    fields
    id
  }
}
`
export const deleteResourceMutation = gql`
mutation DeleteReservationForm($deleteReservationFormId: String!) {
  deleteReservationForm(id: $deleteReservationFormId) {
    id
    serviceName
    serviceId
    fields
  }
}
`
export const bulkDeleteResourceMutation= gql`
mutation BulkDelteReservationForm($ids: [String]) {
  bulkDelteReservationForm(ids: $ids) {
    id
    serviceName
    serviceId
    fields
  }
}
`
export const updateReservationMuation = gql`
mutation UpdateReservationForm($input: updateReservationInput) {
  updateReservationForm(input: $input) {
    id
    serviceName
    serviceId
    fields
  }
}`