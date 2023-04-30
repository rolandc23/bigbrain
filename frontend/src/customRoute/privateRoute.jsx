import React from 'react';
import getToken from '../helpers/getToken';
import { Navigate } from 'react-router-dom';

/*
PrivateRoute
Allows for routes to be only visible to admin
and not players
*/
const PrivateRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to='/' />
}

export default PrivateRoute;
