import React from 'react';
import getToken from '../helpers/getToken';
import API from '../api';
import defImage from '../images/defquizimage.jpg';
import getDateTime from '../helpers/getDateTime';
import getQuizDetails from '../helpers/getQuizDetails';
import endQuiz from '../helpers/endQuiz';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import modalStyle from '../styles/modalStyle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import AllQuizzesContainer from '../styles/AllQuizzesContainer';

/*
GetAllQuizzes
Handles the quiz list/grid in a user's dashboard
*/
function GetAllQuizzes ({ newGameShow }) {
  const [quizzes, setQuizzes] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [quizId, setQuizId] = React.useState();
  const [sessionId, setSessionId] = React.useState();
  const token = getToken();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Gets all of a user's quizzes
  React.useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const response = await API.get('admin/quiz', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal,
        })
        const data = await response.data;
        for (const quiz in data.quizzes) {
          data.quizzes[quiz].numQuestions = await getQuizLength(data.quizzes[quiz].id);
          data.quizzes[quiz].duration = await getQuizDuration(data.quizzes[quiz].id);
        }
        setQuizzes(data.quizzes);
        controller = null;
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      controller?.abort();
    }
  }, [newGameShow, change]);

  // Allows for the deletion of a quiz
  async function doDeleteQuiz (Id) {
    await API.delete(`admin/quiz/${Id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    setChange(!change);
  }

  // Navigates to the edit quiz page
  // if the button is pressed
  function getEditQuizPage (Id) {
    navigate(`/editquiz/${Id}`)
  }

  // Gets the number of questions in the quiz
  async function getQuizLength (Id) {
    let controller = new AbortController();
    const quizDeets = await getQuizDetails(Id, controller);
    controller = null;
    return quizDeets.questions.length;
  }

  // Gets the estimation of the quiz duration
  // based on the length of all the questions combined
  async function getQuizDuration (Id) {
    let controller = new AbortController();
    const quizDeets = await getQuizDetails(Id, controller);
    const questions = await quizDeets.questions;
    let totalDuration = 0;
    questions.map(question =>
      (totalDuration += parseInt(question.duration, 10))
    )
    controller = null;
    return Math.round(totalDuration / 60);
  }

  // Tries to get a sessionID of a quiz if it
  // exists
  async function getSeshId (Id) {
    try {
      const response = await API.get(`admin/quiz/${Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data.active;
    } catch (Error) {
      console.log(Error);
    }
  }

  // Starts the quiz, navigates to the lobby page
  // with the generated sessionId
  async function startQuiz (Id) {
    try {
      await API.post(`admin/quiz/${Id}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } catch (Error) {
      console.log(Error);
    }
    const sessId = await getSeshId(Id);
    navigate(`/startquiz/${Id}/${sessId}`);
  }

  async function adminQuiz (Id, seshId) {
    try {
      const response = await API.get(`admin/session/${seshId}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      navigate(`/${response.data.results.position === -1 ? 'startquiz' : 'quizadmin'}/${Id}/${seshId}`)
    } catch (error) {
      console.log(error);
    }
  }

  // Ends a quiz if it is running, opens the modal
  // to provide an option to go to results page
  async function forceEnd (Id, seshId) {
    await endQuiz(Id, token);
    setQuizId(Id);
    setSessionId(seshId);
    setChange(!change);
    handleOpen();
  }

  // From the modal, the admin can navigate to the results page
  function goResults () {
    handleClose();
    navigate(`/resultsadmin/${quizId}/${sessionId}`)
  }

  // From the modal, the admin can navigate to the dashboard page
  function goDashboard () {
    handleClose();
    navigate('/dashboard')
  }

  // Handles the downloading of quizzes
  const exportData = (Id, quizDeets) => {
    const quizString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(quizDeets)
    )}`;
    const link = document.createElement('a');
    link.href = quizString;
    link.download = `quiz-${Id}.json`;
    link.click();
  };

  // Downloads a quiz
  async function downloadQuiz (Id) {
    let controller = new AbortController();
    const quizDeets = await getQuizDetails(Id, controller);
    exportData(Id, quizDeets);
    controller = null;
  }

  return (
    <AllQuizzesContainer>
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
      {quizzes.map((quiz, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            border: '2px solid #e0dfdc',
            borderRadius: '10px',
            padding: '0px 50px 0px 50px',
            marginBottom: '5px',
            width: '260px',
          }}
        >
        <Typography variant="h6" align="center">
          {quiz.name}
        </Typography>
        <ButtonGroup variant="text" aria-label="text button group">
          <Button variant="outlined" size="small" name={quiz.name} onClick={() => getEditQuizPage(quiz.id)}>Edit Quiz</Button>
          {quiz.active
            ? (<><Button variant="outlined" size="small" name={`admin-${quiz.name}`} onClick={() => adminQuiz(quiz.id, quiz.active)}>Administrate Quiz</Button>
            <Button variant="outlined" size="small" onClick={() => forceEnd(quiz.id, quiz.active)}>End Quiz</Button></>)
            : (<><Button variant="outlined" size="small" name={`start-${quiz.name}`} onClick={() => startQuiz(quiz.id)}>Start Quiz</Button></>)
          }
        </ButtonGroup>
        <Typography variant="body1" align="center">
          Created {getDateTime(quiz.createdAt)}<br />
          {quiz.active
            ? (<>Currently active!<br /></>)
            : (<>Currently inactive :c<br /></>)
          }
          <>{quiz.numQuestions} questions<br /></>
          <>Estimated quiz duration: {quiz.duration} minutes<br /></>
        </Typography>
        {quiz.thumbnail
          ? (<><img src={quiz.thumbnail} height='100' width='100' alt='unique thumbnail to provide context about this quiz' ></img><br /></>)
          : (<><img src={defImage} height='100' width='100' alt='default image of "big brain", no thumbnail has been set for this quiz currently' ></img><br /></>)
        }
        <ButtonGroup variant="text" aria-label="text button group">
          <Button variant="outlined" size="small" name={`oldSesh-${quiz.name}`} onClick={() => navigate(`/sessions/${quiz.id}`)}>Old Sessions</Button><br />
          <Button variant="outlined" size="small" name={`delete-${quiz.name}`} onClick={() => doDeleteQuiz(quiz.id)}>Delete quiz</Button><br />
          <Button variant="outlined" size="small" onClick={() => downloadQuiz(quiz.id)}>Download Quiz</Button>
        </ButtonGroup>
        <br /><br />
      </Box>
      ))}
    </AllQuizzesContainer>
  )
}

export default GetAllQuizzes;
