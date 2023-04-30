import React from 'react';
import data from '../config.json';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import modalStyle from '../styles/modalStyle';
import advanceQuiz from '../helpers/advanceQuiz';
import SessionPlayerList from '../components/SessionPlayerList';
import getToken from '../helpers/getToken';
import API from '../api';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';

/*
Start Quiz
Handles the lobby page for the admin
Allows the admin to see what players have joined
And for the admin to start the quiz session
*/
function StartQuiz () {
  const quizId = useParams().quizId;
  const sessionId = useParams().sessionId;
  const token = getToken();
  const navigate = useNavigate()
  const [sessionPlayers, setSessionPlayers] = React.useState([]);

  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Starts the quiz
  function beginQuiz () {
    advanceQuiz(quizId, token);
    navigate(`/quizadmin/${quizId}/${sessionId}`);
  }

  // Copies the link to be able to join the game
  function copyLink (e, link) {
    navigator.clipboard.writeText(link);
    e.preventDefault();
  }

  // Polls the status of the session
  React.useEffect(() => {
    const intervalId = setInterval(async () => {
      let controller = new AbortController();
      (async () => {
        try {
          const response = await API.get(`admin/session/${sessionId}/status`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              signal: controller.signal
            }
          )
          const data = await response.data;
          setSessionPlayers(data.results.players);
        } catch (error) {
          console.log(error);
        }
        controller = null;
      })();
      return () => controller?.abort();
    }, 1000)
    return () => clearInterval(intervalId);
  })

  const link = `http://localhost:${data.FRONTEND_PORT}/joinquiz?gameId=${sessionId}&playername=`

  return (
    <main>
      <Modal
        role="status"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
            <>Game is about to begin, click <a href='' name='copyLink' id={link} onClick={(e) => copyLink(e, link)}>{sessionId}</a> and share this link for others to join.<br /></>
            </Typography>
            <Button variant="contained" name="closeModalBtn" onClick={handleClose}>Close</Button>
          </Box>
        </Fade>
        </div>
      </Modal>
      <section>
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
      <Typography variant='h5' align='center'>
      <br /><b>Quiz is about to begin! </b><br />
      </Typography>
      <Typography variant='body1' align='center'>
        <br />
        Join with code <b>{sessionId}</b> at <a href='' name='copyLink' id={link} onClick={(e) => copyLink(e, `http://localhost:${data.FRONTEND_PORT}/joinquiz`)}>{`http://localhost:${data.FRONTEND_PORT}/joinquiz`}</a><br />
        Join with link <a href='' name='copyLink' id={link} onClick={(e) => copyLink(e, link)}>{link}</a><br />
        Points are given based on how fast you answer relative to the question duration! (minimum at 50% of maximum points and duration)<br />
        </Typography>
        <SessionPlayerList sessionPlayers={sessionPlayers}/>
        <ButtonGroup variant="text" aria-label="text button group">
          <Button size="small" variant="outlined" name='startQuestionsBtn' onClick={() => beginQuiz()}>Start Questions</Button>
          <Button size="small" variant="outlined" onClick={() => handleOpen()}>Open popup</Button>
        </ButtonGroup>
      </Box>
      </Box>
      </section>
    </main>
  )
}

export default StartQuiz;
