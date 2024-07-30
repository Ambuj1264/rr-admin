import { gql } from "@apollo/client";

export const itemMutations = gql`
  mutation CreateProductItem($input: ItemDetails) {
    createProductItem(input: $input) {
      id
      basicQuantity
      deluxeQuantity
      itemName
      superDeluxeQuantity
    }
  }
`;
export const deleteProductItems = gql`
  mutation DeleteProductItem($deleteProductItemId: String!) {
    deleteProductItem(id: $deleteProductItemId) {
      id
      basicQuantity
      deluxeQuantity
      itemName
      superDeluxeQuantity
      isDeleted
    }
  }
`;

export const bulkItemMutations= gql`
mutation DeleteProductItem($ids: [String]) {
  bulkProductItemDelete(ids: $ids) {
    id
    basicQuantity
    deluxeQuantity
    itemName
    superDeluxeQuantity
    isDeleted
  }
}`

export const updateItemMuation= gql`
mutation UpdateProductItems($input: editProductItem) {
  updateProductItems(input: $input)
}
`
