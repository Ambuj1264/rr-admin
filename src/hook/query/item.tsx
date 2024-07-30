import { gql } from "@apollo/client";

export const productItemsListingQuery=gql`
query ProductItemsListing {
  productItemsListing {
    id
    basicQuantity
    deluxeQuantity
    itemName
    superDeluxeQuantity
  }
}
`

export const productItemsQuery= gql`
query FindProductItems($findProductItemsId: String!) {
    findProductItems(id: $findProductItemsId) {
      id
      basicQuantity
      deluxeQuantity
      itemName
      superDeluxeQuantity
      isDeleted
    }
  }`