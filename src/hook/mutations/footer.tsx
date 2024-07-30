import { gql } from '@apollo/client';


export const deleteFooterMutation = gql`
mutation Mutation($deleteFooterId: String!) {
  deleteFooter(id: $deleteFooterId) {
    id
    footerLogo
    footerDescription
    socialMedia {
      facebook
      twitter
      instagram
      linkedin
    }
    isDeleted
  }
}
`