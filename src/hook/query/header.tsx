import { gql } from "@apollo/client";

export const headerDataQuery=gql`
query HeaderData {
  headerData {
    id
    imageName
    altName
  }
}
`;
