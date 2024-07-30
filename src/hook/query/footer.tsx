import { gql } from "@apollo/client";

export const footerQuery=gql`
query FooterData {
  footerData {
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
}`