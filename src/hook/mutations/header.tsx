import { gql } from "@apollo/client";
export const deleteHeaderMutation=gql`
mutation DeleteHeader($deleteHeaderId: String!) {
  deleteHeader(id: $deleteHeaderId) {
    id
    imageName
    altName
    isDeleted
  }
}
`;
