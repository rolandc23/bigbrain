import React from 'react';
import getToken from '../helpers/getToken';
import { Navigate } from 'react-router-dom';

/*
PublicRoute
Allows for routes to be seen by anyone
*/
const PublicRoute = ({ children }) => {
  const token = getToken();
  console.log(token);
  return !token ? children : <Navigate to={'/dashboard'} />
}

export default PublicRoute;
