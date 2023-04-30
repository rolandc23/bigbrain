import React from 'react';
import getQuizDetails from '../helpers/getQuizDetails';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import getToken from '../helpers/getToken';
import imageToDataUrl from '../helpers/getImage';
import videoToDataUrl from '../helpers/getVideo';
import Modal from '@mui/material/Modal';
import modalStyle from '../styles/modalStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

/*
EditQuestion
Handles the page that shows to edit
all the components in a question
*/
function EditQuestion () {
  const questionId = useParams().questionId;
  const quizId = useParams().quizId;
  const token = getToken();
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [questionString, setQuestionString] = React.useState('');
  const [questionType, setQuestionType] = React.useState('');
  const [questionNumOptions, setQuestionNumOptions] = React.useState('2');
  const [questionPoints, setQuestionPoints] = React.useState(1000);
  const [questionUpload, setQuestionUpload] = React.useState('');
  const [questionUploadType, setQuestionUploadType] = React.useState('');
  const [questionOptions, setQuestionOptions] = React.useState();
  const [questionDuration, setQuestionDuration] = React.useState(0);
  const [questionCorrectAnswers, setQuestionCorrectAnswers] = React.useState({});
  const [questionSingleAnswer, setQuestionSingleAnswer] = React.useState('A');

  const [invalidEmbed, setInvalidEmbed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [disabled, setDisabled] = React.useState();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const list = [...Array(6).keys()];
  const checkboxRef = list.map(x => React.useRef(null));

  // Updates the disabled status
  function updateDisabled () {
    let answerExists = false;
    checkboxRef.map((ele) => {
      if (ele.current?.checked) {
        answerExists = true;
      }
      return checkboxRef;
    })
    setDisabled((!(answerExists) ||
      questionDuration <= 0 ||
      questionPoints <= 0 ||
      (questionUploadType === 'embed' && !questionUpload?.startsWith('https://www.youtube.com/embed/'))
    ));
  }

  // Sets all the values by getting the question
  // details from the quiz details
  React.useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const currQuiz = await getQuizDetails(quizId, controller);
        setQuizQuestions(currQuiz.questions);
        setQuestionString(currQuiz.questions[questionId].string);
        setQuestionType(currQuiz.questions[questionId].type);
        setQuestionOptions(currQuiz.questions[questionId].options);
        setQuestionDuration(currQuiz.questions[questionId].duration);
        setQuestionPoints(currQuiz.questions[questionId].points);
        setQuestionUpload(currQuiz.questions[questionId].mediaUpload);
        setQuestionUploadType(currQuiz.questions[questionId].uploadType);
        setQuestionNumOptions(currQuiz.questions[questionId].numOptions);
        setQuestionCorrectAnswers(currQuiz.questions[questionId].correctAnswers);
        setErrorMessage('');
        const correctAnswers = currQuiz.questions[questionId].correctAnswers;
        if (currQuiz.questions[questionId].type === 'singleAnswer') {
          const correctArray = Object.keys(correctAnswers).filter(function (key) {
            return !!correctAnswers[key]
          })
          setQuestionSingleAnswer(correctArray[0]);
        }
        controller = null;
      } catch (error) {
        setErrorMessage(error.message);
        handleOpen();
      }
    })();
    return () => controller?.abort();
  }, []);

  // Saves the changes
  async function saveChanges () {
    await API.put(`admin/quiz/${quizId}`,
      {
        questions: quizQuestions
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    navigate(`/editquiz/${quizId}`);
    localStorage.removeItem('questionId');
  }

  // Saves the question values
  function saveQuestions () {
    const questionsCopy = quizQuestions;
    questionsCopy[questionId] = {
      id: questionId,
      string: questionString,
      type: questionType,
      options: questionOptions,
      duration: questionDuration,
      numOptions: questionNumOptions,
      mediaUpload: questionUploadType ? questionUpload : '',
      uploadType: questionUpload ? questionUploadType : 'none',
      points: questionPoints,
      correctAnswers: getCorrectAnswers()
    }
    if (!checkAtLeastOneAnswer()) return;
    if (!checkIfUploaded()) return;
    setQuizQuestions(questionsCopy);
    saveChanges();
  }

  // Checks that there is an answer to the question
  function checkAtLeastOneAnswer () {
    let answerExists = false;
    checkboxRef.map((ele) => {
      if (ele.current?.checked) {
        answerExists = true;
      }
      return checkboxRef;
    })
    if (!answerExists) {
      setErrorMessage('There must be at least one correct answer!')
      handleOpen();
    } else {
      setErrorMessage('')
    }
    return (answerExists);
  }

  // Check if the uploaded type matches what is uploaded
  function checkIfUploaded () {
    console.log(questionUploadType);
    if (questionUploadType === 'none' || questionUploadType === 'None') return true;
    if (!questionUpload) {
      setErrorMessage('Warning: Please ensure you have uploaded a valid media file or have a valid youtube embed link. Otherwise, select "None" for upload type.')
      handleOpen();
    } else {
      setErrorMessage('')
    }
    return (questionUpload);
  }

  // Gets the correct answers
  function getCorrectAnswers () {
    const updatedAnswers = {
      A: checkboxRef[0].current?.checked,
      B: checkboxRef[1].current?.checked,
      C: false,
      D: false,
      E: false,
      F: false,
    }
    if (questionNumOptions >= 3) updatedAnswers.C = checkboxRef[2].current?.checked;
    if (questionNumOptions >= 4) updatedAnswers.D = checkboxRef[3].current?.checked;
    if (questionNumOptions >= 5) updatedAnswers.E = checkboxRef[4].current?.checked;
    if (questionNumOptions >= 6) updatedAnswers.F = checkboxRef[5].current?.checked;
    return updatedAnswers;
  }

  // Sets a single answer as the question type
  function doSetSingleAnswer (option) {
    setQuestionSingleAnswer(option);
    updateDisabled();
  }

  // Allows for uploading of image
  async function uploadImage (file) {
    if (file && file[0]) {
      try {
        const res = await imageToDataUrl(file[0]);
        setQuestionUpload(res);
        setErrorMessage('')
      } catch (error) {
        setErrorMessage(error.message);
        handleOpen();
      }
    }
  }

  // Allows for uploading of video (this is limited to 1mb size from testing)
  async function uploadVideo (file) {
    if (file && file[0]) {
      try {
        const res = await videoToDataUrl(file[0]);
        setQuestionUpload(res);
        setErrorMessage('')
      } catch (error) {
        setErrorMessage(error.message);
        handleOpen();
      }
    }
  }

  React.useEffect(() => {
    const timeOutId = setTimeout(() => updateDisabled(), 100);
    return () => clearTimeout(timeOutId);
  }, [questionDuration, questionPoints, questionUpload, questionUploadType]);

  const firstUpdate = React.useRef(0);
  React.useEffect(() => {
    if (firstUpdate.current < 2) {
      firstUpdate.current += 1;
      return;
    }
    const timeOutId = setTimeout(() => setQuestionUpload(''), 100);
    return () => clearTimeout(timeOutId);
  }, [questionUploadType]);

  function doSetQuestionOption (index, string) {
    const questionOptionsCopy = questionOptions;
    questionOptionsCopy[index] = string;
    setQuestionOptions(questionOptionsCopy);
  }

  React.useEffect(() => {
    const timeOutId = setTimeout(() => {
      checkValidEmbed();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [questionUpload])

  // Check if the provided link is an youtube embed link
  function checkValidEmbed () {
    if (questionUploadType !== 'embed') return;
    if (questionUpload.startsWith('https://www.youtube.com/embed/')) {
      setInvalidEmbed('')
    } else {
      setInvalidEmbed('The embed link must be youtube (i.e. starts with https://www.youtube.com/embed/)');
    }
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
      <Typography variant="h6" align="left">
        <br />Editing Question {parseInt(questionId, 10) + 1} from quiz {quizId}<br /><br />
      </Typography>
        <TextField
          required
          fullWidth
          variant="standard"
          name='editQuestionStr'
          label="Question"
          value={questionString}
          onChange={(e) => setQuestionString(e.target.value)}
        /><br />
        <TextField
          required
          fullWidth
          variant="standard"
          name='editQuestionDuration'
          type='number'
          label="Duration"
          value={questionDuration}
          onChange={(e) => setQuestionDuration(e.target.value)}
        /><br />
        <TextField
          required
          fullWidth
          variant="standard"
          name='editQuestionPoints'
          type='number'
          label="Points"
          value={questionPoints}
          onChange={(e) => setQuestionPoints(e.target.value)}
        /><br />
        <Typography variant="body1" align="center">
          Media Type:
        </Typography>
        <Select
          fullWidth
          size="small"
          value={questionUploadType}
          id='selectUploadType'
          label=""
          onChange={(e) => setQuestionUploadType(e.target.value)}
        >
          <MenuItem value='uploadImage'>Upload Image</MenuItem>
          <MenuItem value='uploadVideo'>Upload Video</MenuItem>
          <MenuItem value='embed'>Use youtube embed link</MenuItem>
          <MenuItem value='none'>None</MenuItem>
        </Select><br />
        {questionUploadType === 'uploadImage'
          ? <><Typography variant="body1" align="center"><label htmlFor="uploadQuestionImage">Upload Image: </label>
          <input type='file' name='uploadQuestionImage' id="uploadQuestionImage" onChange={(e) => uploadImage(e.target.files)}></input><br /></Typography></>
          : questionUploadType === 'uploadVideo'
            ? <><Typography variant="body1" align="center"><label htmlFor="uploadQuestionVideo">Upload Video: </label>
            <input type='file' name='uploadQuestionVideo' id="uploadQuestionVideo" onChange={(e) => uploadVideo(e.target.files)}></input><br /></Typography></>
            : questionUploadType === 'embed'
              ? <>
              <TextField
                required
                fullWidth
                variant="standard"
                name='addEmbedLink'
                id='addEmbedLink'
                label="Embed Link"
                value={questionUpload}
                onChange={(e) => setQuestionUpload(e.target.value)}
              /><br />
              <>{invalidEmbed && <>{invalidEmbed}<br /></>}</>
              </>
              : <><Typography variant="body1" align="center">No media will be selected<br /></Typography></>
        }
        <Typography variant="body1" align="center">
        {(questionUploadType === 'uploadImage')
          ? <>Media Upload: <br /><img src={questionUpload} alt='Currently no image has been uploaded' height='100' width='100'></img><br /></>
          : (questionUploadType === 'uploadVideo' || questionUploadType === 'embed')
              ? (<>Media Upload: <br /><iframe
                  alt='Currently no video has been uploaded/embedded'
                  width="500"
                  height="300"
                  src={(questionUploadType === 'uploadVideo' || !invalidEmbed) ? questionUpload : ''}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                /><br /></>)
              : <></>
        }
        <br />
        </Typography>
        <Select
          fullWidth
          size='small'
          value={questionType}
          id='editQuestionType'
          label=""
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <MenuItem value='singleAnswer'>Single Answer</MenuItem>
          <MenuItem value='multiAnswer'>Multiple Answer</MenuItem>
        </Select><br />
        <Typography variant="body1" align="left">
        Number of Questions:<br />
        </Typography>
        <Select
          fullWidth
          size='small'
          value={questionNumOptions}
          id='editQuestionNumOptions'
          label=""
          onChange={(e) => setQuestionNumOptions(e.target.value)}
        >
          <MenuItem value='2'>2</MenuItem>
          <MenuItem value='3'>3</MenuItem>
          <MenuItem value='4'>4</MenuItem>
          <MenuItem value='5'>5</MenuItem>
          <MenuItem value='6'>6</MenuItem>
        </Select><br />
        {questionType === 'singleAnswer' &&
          <>
              Correct Answer: <br />
              A: <input type="checkbox" name='singleA' ref={checkboxRef[0]} checked={questionSingleAnswer === 'A'} onChange={() => doSetSingleAnswer('A')}/><br />
              B: <input type="checkbox" name='singleB' ref={checkboxRef[1]} checked={questionSingleAnswer === 'B'} onChange={() => doSetSingleAnswer('B')}/><br />
              {(questionNumOptions >= 3) && (
              <>
                C: <input
                  type="checkbox"
                  name='singleC'
                  ref={checkboxRef[2]}
                  checked={questionSingleAnswer === 'C'}
                  onChange={() => doSetSingleAnswer('C')} />
                <br />
              </>
              )}
              {(questionNumOptions >= 4) && (
              <>
                D: <input
                  type="checkbox"
                  name='singleD'
                  ref={checkboxRef[3]}
                  checked={questionSingleAnswer === 'D'}
                  onChange={() => doSetSingleAnswer('D')} />
                <br />
              </>
              )}
              {(questionNumOptions >= 5) && (
              <>
                E: <input
                  type="checkbox"
                  name='singleE'
                  ref={checkboxRef[4]}
                  checked={questionSingleAnswer === 'E'}
                  onChange={() => doSetSingleAnswer('E')} />
                <br />
              </>
              )}
              {(questionNumOptions >= 6) && (
              <>
                F: <input
                  type="checkbox"
                  name='singleF'
                  ref={checkboxRef[5]}
                  checked={questionSingleAnswer === 'F'}
                  onChange={() => doSetSingleAnswer('F')} />
                <br />
              </>
              )}
          </>
        }
        {questionType === 'multiAnswer' &&
          <>
            Correct Answer: <br />
              A: <input type="checkbox" name='multiA' defaultChecked={questionCorrectAnswers.A} ref={checkboxRef[0]} onChange={() => updateDisabled()}/><br />
              B: <input type="checkbox" name='multiB' defaultChecked={questionCorrectAnswers.B} ref={checkboxRef[1]} onChange={() => updateDisabled()}/><br />
              {(questionNumOptions >= 3) && (
                <>
                  C: <input type="checkbox" name='multiC' defaultChecked={questionCorrectAnswers.C} ref={checkboxRef[2]} onChange={() => updateDisabled()}/><br />
                </>
              )}
              {(questionNumOptions >= 4) && (
                <>
                  D: <input type="checkbox" name='multiD' defaultChecked={questionCorrectAnswers.D} ref={checkboxRef[3]} onChange={() => updateDisabled()}/><br />
                </>
              )}
              {(questionNumOptions >= 5) && (
                <>
                  E: <input type="checkbox" name='multiE' defaultChecked={questionCorrectAnswers.E} ref={checkboxRef[4]} onChange={() => updateDisabled()}/><br />
                </>
              )}
              {(questionNumOptions >= 6) && (
                <>
                  F: <input type="checkbox" name='multiF' defaultChecked={questionCorrectAnswers.F} ref={checkboxRef[5]} onChange={() => updateDisabled()}/><br />
                </>
              )}
          </>
        }
        {(questionOptions) && (
        <>
        <TextField
          required
          fullWidth
          variant="standard"
          name='optionA'
          label="Option A"
          defaultValue={questionOptions[0]}
          onChange={(e) => doSetQuestionOption(0, e.target.value)}
        /><br />
          <TextField
            required
            fullWidth
            variant="standard"
            name='optionB'
            label="Option B"
            defaultValue={questionOptions[1]}
            onChange={(e) => doSetQuestionOption(1, e.target.value)}
          /><br />
        </>
        )}
        {(questionNumOptions >= 3) && (
          <>
            <TextField
              required
              fullWidth
              variant="standard"
              name='optionC'
              label="Option C"
              defaultValue={questionOptions[2]}
              onChange={(e) => doSetQuestionOption(2, e.target.value)}
            /><br />
          </>
        )}
        {(questionNumOptions >= 4) && (
          <>
            <TextField
              required
              fullWidth
              variant="standard"
              name='optionD'
              label="Option D"
              defaultValue={questionOptions[3]}
              onChange={(e) => doSetQuestionOption(3, e.target.value)}
            /><br />
          </>
        )}
        {(questionNumOptions >= 5) && (
          <>
            <TextField
              required
              fullWidth
              variant="standard"
              name='optionE'
              label="Option E"
              defaultValue={questionOptions[4]}
              onChange={(e) => doSetQuestionOption(4, e.target.value)}
            /><br />
          </>
        )}
        {(questionNumOptions >= 6) && (
          <>
            <TextField
              required
              fullWidth
              variant="standard"
              name='optionF'
              label="Option F"
              defaultValue={questionOptions[5]}
              onChange={(e) => doSetQuestionOption(5, e.target.value)}
            /><br />
          </>
        )}
      <Button size="small" style={{ marginBottom: '5px', marginTop: '5px' }} variant="outlined" name='saveQuestionBtn' onClick={() => saveQuestions()} disabled={disabled}>Save question</Button>
      </Box>
      </Box>
      </section>
    </main>
  );
}

export default EditQuestion;
