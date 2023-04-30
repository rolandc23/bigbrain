import React from 'react';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import useInterval from '../helpers/useInterval';
import getToken from '../helpers/getToken';
import advanceQuiz from '../helpers/advanceQuiz';
import endQuiz from '../helpers/endQuiz';
import Modal from '@mui/material/Modal';
import modalStyle from '../styles/modalStyle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';

/*
Admin Question:
This is the page that the admin sees during the game.
It allows them to end the game, advance the current question (to next question),
and when the game ends, it will show an option to view the results of the played game.
*/
function AdminQuestion () {
  const quizId = useParams().quizId;
  const sessionId = useParams().sessionId;
  const token = getToken();
  const [isActive, setIsActive] = React.useState(null);
  const [dummyPosition, setDummyPosition] = React.useState(0);
  const [sessionPosition, setSessionPosition] = React.useState(0);
  const [sessionDeets, setSessionDeets] = React.useState({});
  const [currQuestion, setCurrQuestion] = React.useState(null);
  const [options, setOptions] = React.useState();
  const [sessionLastQuestionStart, setSessionLastQuestionStart] = React.useState([]);
  const [sessionAnswerAvailable, setSessionAnswerAvailable] = React.useState(false);
  const [timer, setTimer] = React.useState();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // countDown calculates the remaining time
  // in the current question.
  const countDown = () => {
    const difference = +new Date(sessionLastQuestionStart) + timer - +new Date();
    const timeLeft = Math.round(difference / 1000);
    return timeLeft;
  };

  const [timeRemaining, setTimeRemaining] = React.useState(countDown());

  // Polls the status of the current game session
  // And sets relevant values
  React.useEffect(() => {
    if (sessionAnswerAvailable) return;
    let controller = new AbortController();
    (async () => {
      const timeOutId = setTimeout(async () => {
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
          const results = await data.results;
          const question = await results.questions[results.position];
          setSessionDeets(results);
          setSessionPosition(results.position);
          setCurrQuestion(question);
          setSessionLastQuestionStart(results.isoTimeLastQuestionStarted);
          setSessionAnswerAvailable(results.answerAvailable);
          setTimer(results.questions[results.position].duration * 1000);
        } catch (error) {
          console.log(error);
        }
        controller = null;
      }, 100);
      return () => clearTimeout(timeOutId);
    })();
    return () => controller?.abort();
  }, [timeRemaining])

  // Check if the current question has changed
  // if it has then change the options
  React.useEffect(() => {
    if (currQuestion) setOptions(currQuestion.options);
  }, [currQuestion])

  useInterval(() => {
    if (sessionAnswerAvailable) return;
    setTimeRemaining(countDown());
  }, 870)

  // Check if the current game is active
  React.useEffect(() => {
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
        setIsActive(response.data.results.active);
      } catch (Error) {
        console.log(Error);
      }
      controller = null;
    })();
    return () => controller?.abort;
  }, [])

  // Advances the quiz to next question
  // If there are further questions, else end the game
  async function doAdvanceQuiz () {
    try {
      if (sessionPosition < sessionDeets.questions.length - 1) {
        await advanceQuiz(quizId, token);
        setDummyPosition(dummyPosition + 1);
        setSessionAnswerAvailable(false);
      } else {
        doEndQuiz();
      }
    } catch (Error) {
      console.log('Quiz has ended');
    }
  }

  // Ends the quiz and opens the modal
  async function doEndQuiz () {
    await endQuiz(quizId, token);
    handleOpen();
  }

  // Closes the modal and navigates to the results page (admin side)
  function goResults () {
    handleClose();
    navigate(`/resultsadmin/${quizId}/${sessionId}`)
  }

  // Closes the modal and navigates to dashboard
  function goDashboard () {
    handleClose();
    navigate('/dashboard')
  }

  return (
    <section>
      {open &&
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          role="status"
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
              Game has been stopped, would you like to view results?
              </Typography>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button variant="outlined" name='goResults' onClick={() => goResults()}>Yes</Button>
                <Button variant="outlined" name='goDashboard' onClick={() => goDashboard()}>No</Button>
              </ButtonGroup>
            </Box>
          </Fade>
          </div>
        </Modal>
      }
      { (isActive && currQuestion && options) &&
        <>
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
            <Typography role="timer" variant="body1" align="center">
              <br /><b>Question {sessionPosition + 1}: {currQuestion.string}</b><br />
              <>Type: {currQuestion.type === 'singleAnswer'
                ? <>Single Answer</>
                : <>Multiple Answers</>
            }</><br />
              <>Timer: {timeRemaining > 0 ? (<>{timeRemaining}</>) : (<>0</>)}</><br />
              <>Number of options: {currQuestion.numOptions}</><br />
              {(currQuestion.uploadType === 'uploadImage')
                ? <>Media Upload: <br /><img alt='Image provided as context for this question' src={currQuestion.mediaUpload} height='100' width='100'></img><br /></>
                : (currQuestion.uploadType === 'uploadVideo' || currQuestion.uploadType === 'embed')
                    ? <>Media Upload: <br />
                      <iframe
                        alt='Video provided as context for this question'
                        width="500"
                        height="300"
                        src={currQuestion.mediaUpload}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded youtube"
                      /><br /></>
                    : <></>
              }
            </Typography>
            {sessionAnswerAvailable && <Typography variant="body1" align="left"><b>ANSWER AVAILABLE !!!! <br /></b></Typography>}
            <Typography variant="body1" align="left">
              <>A: {options[0]} {currQuestion.correctAnswers?.A && sessionAnswerAvailable && <b>(Correct)</b>}</><br />
              <>B: {options[1]} {currQuestion.correctAnswers?.B && sessionAnswerAvailable && <b>(Correct)</b>}</><br />
              {currQuestion.numOptions >= 3 && <>C: {options[2]} {currQuestion.correctAnswers.C && sessionAnswerAvailable && <b>(Correct)</b>}<br /></>}
              {currQuestion.numOptions >= 4 && <>D: {options[3]} {currQuestion.correctAnswers.D && sessionAnswerAvailable && <b>(Correct)</b>}<br /></>}
              {currQuestion.numOptions >= 5 && <>E: {options[4]} {currQuestion.correctAnswers.E && sessionAnswerAvailable && <b>(Correct)</b>}<br /></>}
              {currQuestion.numOptions >= 6 && <>F: {options[5]} {currQuestion.correctAnswers.F && sessionAnswerAvailable && <b>(Correct)</b>}<br /></>}
            </Typography>
              {(sessionPosition + 1 !== sessionDeets.questions?.length) && <Button variant="outlined" size="small" name="advanceQuiz" onClick={() => doAdvanceQuiz()}><b>Go to next question</b></Button>}<br />
          </Box>
        </Box>
        </>
      }
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      >
      <Button style={{ marginTop: '5px' }} size="small" variant="outlined" name="adminEndQuizBtn" onClick={() => doEndQuiz()}><b>End Game</b></Button>
      </Box>
    </section>
  )
}

export default AdminQuestion;
