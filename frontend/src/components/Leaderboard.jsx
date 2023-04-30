import React from 'react';
import Typography from '@mui/material/Typography';

/*
Leaderboard
Creates the 'leaderboard' component of the admin results page
*/
const Leaderboard = ({ topPlayers }) => {
  return (<>
  <Typography variant="h5" align='center'>
    Leaderboard:
  </Typography>
  {(topPlayers)
    ? topPlayers.map((player, index) => (
      <div key={index}><Typography variant="body1" align='left'>{index + 1}: {player.name} with {Math.round(player.points)} points.</Typography><br></br></div>
    ))
    : <>Leaderboard is empty :/</>
    }
  </>
  )
}

export default Leaderboard;
