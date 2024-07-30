
import { gql } from '@apollo/client';

export const loginQuery = gql`
query Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token {
      token
    }
    info {
      id
      email
      userId
      isDeleted
      isActive
      firstName
      lastName
    }
  }
}
`;

export const verifyToken=gql`
query VerifyToken($token: String!) {
  verifyToken(token: $token) {
    oid
    loginId
    email
    iat
    exp
  }
}`


