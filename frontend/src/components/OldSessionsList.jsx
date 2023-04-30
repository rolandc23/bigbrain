import React from 'react';
import API from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import getToken from '../helpers/getToken'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

/*
OldSessionsList
Handles the page showing the list
of old sessions for a specific quiz
and allows the quizadmin to navigate to any of the shown
results
*/
function OldSessionsList () {
  const token = getToken();
  const navigate = useNavigate();
  const quizId = useParams().quizId;
  const [quizName, setQuizName] = React.useState(null);
  const [sessions, setSessions] = React.useState([]);
  const [sessBtns, setSessBtns] = React.useState([]);

  // Gets the sessions through an API call
  // also creates the list of buttons to return.
  React.useEffect(async () => {
    try {
      const response = await API.get(`admin/quiz/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setSessions(response.data.oldSessions);
      setSessBtns(response.data.oldSessions.map((sessionId, index) => (
        <div key={index}><Button name={index} onClick={() => navigate(`/resultsadmin/${quizId}/${sessionId}`)}>View {sessionId} results</Button></div>
      )));
      setQuizName(response.data.name);
    } catch (Error) {
      console.log(Error);
    }
  }, [])

  return (
    <section>
    <Typography variant='h5' align='center'>
      Past Results for {quizName}
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '2px solid #e0dfdc',
        borderRadius: '10px',
        padding: '5px 50px 5px 50px'
      }}
    >
    { (sessions)
      ? <ButtonGroup
      orientation="vertical"
      aria-label="vertical contained button group"
      variant="text"
      >
        {sessBtns}
      </ButtonGroup>
      : <>No sessions to show</>
    }
    </Box>
    </Box>
    </section>
  )
}

export default OldSessionsList;
