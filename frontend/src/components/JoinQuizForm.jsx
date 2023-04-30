import React from 'react';
import API from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import modalStyle from '../styles/modalStyle';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';

/*
JoinQuizForm
Handles the page which shows the
Option to join a quiz with a sessionId
and the player name
*/
function JoinQuizForm () {
  const [Id, setId] = React.useState('')
  const [name, setName] = React.useState('')
  const [disabled, setDisabled] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const seshId = location.search.match(/\?gameId=(.*)&/);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    if (seshId) {
      setId(seshId[1]);
    }
  }, [])

  // Joins the quiz if the given sessionId
  // is a valid one
  async function joinQuiz () {
    try {
      const response = await API.post(`play/join/${Id}`,
        {
          name
        }
      )
      const pId = response.data.playerId;
      localStorage.setItem('playerId', pId);
      console.log(pId);
      let timeoutId = setTimeout(() => {
        navigate(`/playquiz/${Id}/${pId}`);
      }, 100)
      timeoutId = null
      return () => clearTimeout(timeoutId);
    } catch (error) {
      handleOpen();
    }
  }

  React.useEffect(() => {
    setDisabled(name.length === 0);
  }, [name])

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        role="alert"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <div>
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            <>The game ID you have provided is not a valid game session! Please check that you have the correct ID, and ensure that the game has not been started yet.</>
            </Typography>
            <Button variant="contained" onClick={handleClose}>Close</Button>
          </Box>
        </Fade>
        </div>
      </Modal>
      <section>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '40ch' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        noValidate
        autoComplete="off"
      >
      <TextField
        required
        type='text'
        id='gameId'
        name='gameId'
        label="Game Id"
        defaultValue={seshId ? seshId[1] : ''}
        onChange={(e) => { setId(e.target.value) }}
      />
      <TextField
        required
        type='text'
        name='playername'
        label="Player Name"
        onChange={(e) => { setName(e.target.value) }}
      />
      <Button variant="outlined" name="submitJoinQuiz" onClick={joinQuiz} disabled={disabled}>Join Quiz</Button>
      </Box>
      </section>
    </>
  )
}

export default JoinQuizForm;
