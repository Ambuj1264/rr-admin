import { gql } from '@apollo/client';

export const ServiceDesciptionModule = gql`
query ServiceDesciptionModule {
  serviceDesciptionModule {
    id
    serviceName
    serviceSubheading
    serviceDescription
    serviceButton
  }
}
`;