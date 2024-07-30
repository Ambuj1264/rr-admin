import { gql } from "@apollo/client";

export const servicesListingQuery =gql`
query ServiceListing {
  serviceListing {
    id
    serviceName
    altName
    serviceImageName
    priority
    serviceDescription
  }
}
`

export const findServiceQuery= gql`
query FindService($findServiceId: String!) {
  FindService(id: $findServiceId) {
    id
    serviceName
    altName
    serviceImageName
    serviceDescription
    priority
  }
}
` 
export const checkHighPriorityQuery=gql`
query Query {
  CheckPriority
}
`

export const servicePageDetails=gql`
query ServicePageDataListing {
  servicePageDataListing {
    id
    serviceBanner
    serviceDescription
    isDeleted
  }
}`
export const servicePageSingleDescription=gql`
query FindServicePageDeatails($findServicePageDeatailsId: String!) {
  FindServicePageDeatails(id: $findServicePageDeatailsId) {
    id
    serviceBanner
    serviceDescription
    isDeleted
  }
}
`
