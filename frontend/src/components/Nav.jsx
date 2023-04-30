import SignOut from '../helpers/SignOut';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import getToken from '../helpers/getToken';
import getPlayer from '../helpers/getPlayer';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

/*
Nav
Handles the navigation bar and what is on the navigation bar
based on what type of user is on the webpage (ie logged in as quiz admin or player)
*/
const Nav = () => {
  const token = getToken();
  const playerId = getPlayer();
  const navigate = useNavigate();

  // Leave quiz button
  function leaveQuiz () {
    localStorage.removeItem('playerId');
    navigate('/');
  }

  // Logout functionality
  function logout () {
    SignOut();
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <header>
      <nav>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > *': {
            m: 1,
          },
        }}
      >
      {token && (
      <>
        <ButtonGroup variant="text" size="large" aria-label="text button group">
          <Button name='dashboardNavBtn' onClick={() => navigate('/dashboard')}>DashBoard</Button>
          <Button name='signoutNavBtn'onClick={() => logout()}>Sign Out</Button>
        </ButtonGroup>
      </>)}
      {(!token && !playerId) && (
        <>
          <ButtonGroup variant="text" size="large" aria-label="text button group">
            <Button name='registerNavBtn' onClick={() => navigate('/register')}>Sign Up</Button>
            <Button name='loginNavBtn' onClick={() => navigate('/login')}>Sign In</Button>
          </ButtonGroup>
        </>
      )
      }
      {(playerId) && (
        <>
          <ButtonGroup variant="text" size="large" aria-label="text button group">
            <Button name='leavequizNavBtn' onClick={() => leaveQuiz()}>Leave Quiz</Button>
          </ButtonGroup>
        </>
      )}
      </Box>
      </nav>
    </header>
  );
};

export default Nav;
