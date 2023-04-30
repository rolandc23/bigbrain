import React from 'react';
import Typography from '@mui/material/Typography';

/*
SessionPlayerList
Shows the currently joined players in a session
Shows on the admin lobby page
*/
function SessionPlayerList ({ sessionPlayers }) {
  return (
    <>
    <Typography variant='body1' align='center'>
    <b>Current Players: {sessionPlayers ? sessionPlayers.length : '0'}</b><br />
    </Typography>
      {sessionPlayers && sessionPlayers.length > 0
        ? <>{sessionPlayers.map((player, index) => {
          return <div key={index}><Typography variant='body1' align='center'>{index + 1}: {player}</Typography></div>
        })}
        </>
        : <><Typography variant='body1' align='center'>No current players</Typography><br /></>
    }
    </>
  )
}

export default SessionPlayerList;
