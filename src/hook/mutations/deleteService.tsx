import { gql } from "@apollo/client";

export const deleteServiceMutation = gql`
  mutation DeleteServices($deleteServicesId: String!) {
    deleteServices(id: $deleteServicesId) {
      id
      serviceName
      altName
      serviceImageName
      isDeleted
    }
  }
`;

export const bulkDeltedServicesMutation = gql`
  mutation BulkServicesDelete($ids: [String]) {
    bulkServicesDelete(ids: $ids) {
      id
      serviceName
      altName
      serviceImageName
      serviceDescription
      priority
      isDeleted
    }
  }
`;

export const updateServicesMuation = gql`
  mutation Mutation($updateServicePriorityId: String, $priority: Boolean) {
    updateServicePriority(id: $updateServicePriorityId, priority: $priority) {
      id
      serviceName
      altName
      serviceImageName
      serviceDescription
      priority
      isDeleted
    }
  }
`;
export const delteServicePageDescription = gql`
  mutation Mutation($deleteServicesPageDescriptionId: String!) {
    deleteServicesPageDescription(id: $deleteServicesPageDescriptionId) {
      id
      serviceBanner
      serviceDescription
      isDeleted
    }
  }
`;
