import React from 'react';
import getToken from '../helpers/getToken';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

/*
StartingPageButtons
Sets the buttons that show on the
default page ('/').
*/
const StartingPageButtons = () => {
  const token = getToken()
  const navigate = useNavigate();
  return (
    <section>
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
    <>
    <ButtonGroup variant="text" aria-label="text button group">
      <Button variant="outlined" onClick={() => navigate('/joinquiz')}>Join Quiz</Button>
      {(!token) && <Button variant="outlined" onClick={() => navigate('/login')}>Log in</Button>}
    </ButtonGroup>
    </>
    </Box>
    </section>
  )
}

export default StartingPageButtons;
