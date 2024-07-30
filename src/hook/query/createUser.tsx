
import { gql } from '@apollo/client';

export const createUserMutation = gql`
mutation Mutation($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    mobileNumber
    firstName
    lastName
    isDeleted
  }
}
`;

export const forgetPasswordMutation =gql`
mutation LoginReset($input: LoginResetInput!) {
  loginReset(input: $input)
}

`
export const ChangeResetPassword = gql`
mutation Mutation($password: String!, $email: String!) {
  changePassword(password: $password, email: $email) {
    affected
  }
}`