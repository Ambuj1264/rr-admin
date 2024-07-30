import React from 'react'
import {Outlet,Navigate} from "react-router-dom";
import SuspenseLoader from 'src/components/SuspenseLoader';
import { useVerifyQuery } from 'src/hook/query/verify';
export const  authKey=localStorage.getItem("TOKEN") || "";
const ProtectedRoute = () => {
 const  authKey=localStorage.getItem("TOKEN")
 const {loading,data,error} = useVerifyQuery(authKey);
 if(loading){
    return <SuspenseLoader/>
 }
 if(error){
   localStorage.clear();
   return <Navigate  to="/login"/>
 }

  return    data ? <Outlet />: <Navigate  to="/login"/>
 
}

export default ProtectedRoute;