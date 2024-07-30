import { gql } from "@apollo/client";

export const packagesQueryListing = gql`
query PackagesListing {
  packagesListing {
    packages_id
    packages_service
    packages_items
    packages_basic
    packages_deluxe
    packages_superDeluxe
    packages_basicPackagePrice
    packages_deluxePackagePrice
    packages_superDeluxePackagePrice
    packages_isDeleted
    services_id
    services_serviceName
    services_altName
    services_serviceDescription
    services_serviceImage
    services_isDeleted
    services_priority
  }
}
`

export const packageSingleQuery= gql`
query PackageSingleData($packageSingleDataId: String!) {
  packageSingleData(id: $packageSingleDataId) {
    packages_id
    packages_service
    packages_items
    packages_basic
    packages_deluxe
    packages_superDeluxe
    packages_basicPackagePrice
    packages_deluxePackagePrice
    packages_superDeluxePackagePrice
    packages_isDeleted
    services_id
    services_serviceName
    services_altName
    services_serviceDescription
    services_serviceImage
    services_isDeleted
    services_priority
  }
}`