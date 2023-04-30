import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import getPlayer from '../helpers/getPlayer';

/*
PlayerRoute
Defines routes that players are able to access
Prevents players from typing in admin urls and being able to
see those pages.
*/
const PlayerRoute = ({ children }) => {
  const playerId = getPlayer()?.toString();
  const verifyPlayerId = useParams().playerId;
  return (playerId === verifyPlayerId) ? children : <Navigate to='/' />
}

export default PlayerRoute;
