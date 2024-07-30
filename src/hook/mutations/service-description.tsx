import { gql } from "@apollo/client";

export const serviceDescription = gql`
mutation Mutation($input: ServiceDescription) {
  createServiceDescriptionDetails(input: $input) {
    serviceName
    serviceSubheading
    serviceDescription
    serviceButton
    id
  }
}
  `;

export const deleteServiceDescription = gql`

mutation Mutation($deleteServiceDescritionId: String!) {
  deleteServiceDescrition(id: $deleteServiceDescritionId) {
    id
    serviceName
    serviceSubheading
    serviceDescription
    serviceButton
    isDeleted
  }
}`

