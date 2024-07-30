import { gql } from "@apollo/client";

export const createFooterMutation= gql`
mutation CreateFooterMutation($input: CreateFooterInput) {
  createFooterMutation(input: $input) {
    id
    footerLogo
    footerDescription
    socialMedia {
      facebook
      twitter
      instagram
      linkedin
    }
  }
}
  `;
export const updateFooterMutation=gql`
mutation Mutation($input: editFooterInput) {
  editFooter(input: $input)
}
`


