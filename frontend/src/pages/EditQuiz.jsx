import React from 'react';
import API from '../api';
import getQuizDetails from '../helpers/getQuizDetails';
import defImage from '../images/defquizimage.jpg'
import imageToDataUrl from '../helpers/getImage';
import { useNavigate, useParams } from 'react-router-dom';
import getToken from '../helpers/getToken';
import Modal from '@mui/material/Modal';
import UploadNewQuiz from '../components/UploadNewQuiz';
import modalStyle from '../styles/modalStyle';
import QuestionList from '../components/QuestionList';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';

/*
EditQuiz
Handles the page to edit values in a quiz
Also navigates to editQuestion page to edit questions
*/
function EditQuiz () {
  const token = getToken();
  const quizId = useParams().quizId;
  const [editQuizName, setEditQuizName] = React.useState('');
  const [editQuizThumbnail, setEditQuizThumbnail] = React.useState('');
  const [editQuizQuestions, setEditQuizQuestions] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Gets the quiz details and sets necessary values
  React.useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const currQuiz = await getQuizDetails(quizId, controller)
        setEditQuizName(currQuiz.name)
        setEditQuizThumbnail(currQuiz.thumbnail);
        setEditQuizQuestions(currQuiz.questions);
        setErrorMessage('')
        controller = null;
      } catch (error) {
        setErrorMessage(error.message);
        handleOpen();
      }
    })();
    return () => controller?.abort();
  }, []);

  // Checks that the quiz name is not empty
  function checkValidName () {
    if (!editQuizName) {
      setErrorMessage('Quiz needs a name!');
      handleOpen();
    } else {
      setErrorMessage('');
    }
    return (editQuizName);
  }

  // Updates the quiz
  async function updateQuiz () {
    if (!checkValidName()) return;
    await API.put(`admin/quiz/${quizId}`,
      {
        name: editQuizName,
        thumbnail: editQuizThumbnail,
        questions: editQuizQuestions
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    navigate('/dashboard');
  }

  const firstUpdate = React.useRef(0)
  React.useEffect(async () => {
    if (firstUpdate.current < 2) {
      firstUpdate.current += 1;
      return;
    }
    await API.put(`admin/quiz/${quizId}`,
      {
        questions: editQuizQuestions
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }, [editQuizQuestions])

  // Allows for an image to be uploaded
  // as the quiz thumbnail
  async function uploadImage (file) {
    if (file && file[0]) {
      try {
        const res = await imageToDataUrl(file[0]);
        setEditQuizThumbnail(res);
        setErrorMessage('')
      } catch (error) {
        setErrorMessage(error.message);
        handleOpen();
      }
    }
  }

  // Adds a question
  function addQuestion () {
    const questionArray = editQuizQuestions;
    const newQuestion = {
      id: questionArray.length,
      string: 'Enter question here',
      type: 'multiAnswer',
      options: [
        'defaultA',
        'defaultB',
        'defaultC',
        'defaultD',
        'defaultE',
        'defaultF',
      ],
      duration: 30,
      correctAnswers: {
        A: true, // Default answers must have at least one correct
        B: false,
        C: false,
        D: false,
        E: false,
        F: false
      },
      mediaUpload: '',
      points: 1000,
      numOptions: '2',
      uploadType: 'none'
    }
    setEditQuizQuestions(questionArray.concat(newQuestion));
  }

  return (
    <main>
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
            <>{errorMessage}</>
            </Typography>
            <Button variant="contained" onClick={handleClose}>Close</Button>
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
        <Typography variant="h5" align="center"><br />Editing Quiz: {quizId} <br /><br /></Typography>
        <TextField
            required
            style={{ marginBottom: '5px' }}
            variant="standard"
            data-testid="newGameNameInput"
            name="editQuizName"
            label="Name"
            value={editQuizName}
            onChange={(e) => setEditQuizName(e.target.value)}
        /> <br />
      <UploadNewQuiz setEditQuizName={setEditQuizName} setEditQuizThumbnail={setEditQuizThumbnail} setEditQuizQuestions={setEditQuizQuestions} />
      <Typography variant="body1" align="center">
      <label htmlFor="editQuizThumbnail">Thumbnail: </label>
      <input name="editQuizThumbnail" id="editQuizThumbnail" type='file' onChange={(e) => uploadImage(e.target.files)}></input><br /><br />
        {editQuizThumbnail
          ? (<><img name="image-preview" alt='image preview for the uploaded image' src={editQuizThumbnail} height='100' width='100'></img><br /></>)
          : (<><img name="image-default" alt='default big brain thumbnail; no image has been uploaded as thumbnail' src={defImage} height='100' width='100'></img><br /></>)
        }
      </Typography>
      <Button size="small" style={{ marginBottom: '5px', marginTop: '5px' }} variant="outlined" name='saveQuizBtn' onClick={() => updateQuiz()}>Save Quiz</Button> <br />
      </Box>
      </Box>
      <br />
      <Typography variant="h5" align="center">
        <b>Questions<br /></b>
        <Button size="small" style={{ marginBottom: '5px', marginTop: '5px' }} variant="outlined" name='addQuestionBtn' onClick={() => addQuestion()}>Add question</Button>
      </Typography>
      <br />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '30px'
        }}
      >
      <QuestionList editQuizQuestions={editQuizQuestions} setEditQuizQuestions={setEditQuizQuestions}/>
      </Box>
      </section>
    </main>
  )
}

export default EditQuiz;
