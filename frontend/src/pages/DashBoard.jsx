import React from 'react';
import GetAllQuizzes from '../components/GetAllQuizzes';
import MakeNewQuiz from '../components/MakeNewQuiz';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/*
Dashboard
Calls necessary components to show the dashboard
*/
function DashBoard () {
  const [newGameShow, setNewGameShow] = React.useState(false);
  return (
    <main>
      <Typography variant="h4" component="h4" align="center">
        Dashboard!
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
      <section>
        <MakeNewQuiz newGameShow={newGameShow} setNewGameShow={setNewGameShow} />
      </section>
      <section>
        <GetAllQuizzes newGameShow={newGameShow} />
      </section>
      </Box>
    </main>
  )
}

export default DashBoard;
