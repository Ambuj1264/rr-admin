import { useQuery,gql } from '@apollo/client';

const VERIFY = gql`
query Query($token: String!) {
    verifyToken(token: $token) {
      loginId
    }
  }
`;

export const useVerifyQuery=(token:string)=>{
    const {error, loading, data}= useQuery(VERIFY,{
        variables:{
            token: token
        }
    });
    
    return {error, loading, data};

}