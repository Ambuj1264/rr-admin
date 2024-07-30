import { gql } from "@apollo/client";

export const packagesFeildMutation= gql`
mutation CreatePackage($input: PackageInput) {
  createPackage(input: $input) {
    id
    service
    items
    basic
    deluxe
    superDeluxe
    isDeleted
    basicPackagePrice
    deluxePackagePrice
    superDeluxePackagePrice
  }
}
`

export const deletePackagesMuatation=  gql`
mutation DeletePackage($deletePackageId: String!) {
  deletePackage(id: $deletePackageId) {
    id
    service
    items
    basic
    deluxe
    superDeluxe
    isDeleted
    basicPackagePrice
    deluxePackagePrice
    superDeluxePackagePrice
  }
}
`

export const bulkDeletePackagesMuation= gql`
mutation Mutation($ids: [String]) {
  bulkPakagesDelete(ids: $ids) {
    id
    service
    items
    basic
    deluxe
    superDeluxe
    isDeleted
    basicPackagePrice
    deluxePackagePrice
    superDeluxePackagePrice
  }
}`

export const updatePackageMutation= gql`
mutation Mutation($input: editPackageInput) {
  updatePackage(input: $input) {
    id
    service
    items
    basic
    deluxe
    superDeluxe
    isDeleted
    basicPackagePrice
    deluxePackagePrice
    superDeluxePackagePrice
  }
}
`