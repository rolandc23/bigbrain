import React from 'react';
import Modal from '@mui/material/Modal';
import modalStyle from '../styles/modalStyle';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

/*
UploadNewQuiz
Allows for the uploading of new quizzes
Also checks that these uploaded files are valid
quizzes
*/
function UploadNewQuiz ({ setEditQuizName, setEditQuizThumbnail, setEditQuizQuestions }) {
  const [errorMessage, setErrorMessage] = React.useState();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function uploadGame (file) {
    if (file && file[0]) {
      readFileOnUpload(file[0])
    }
  }

  const readFileOnUpload = (uploadedFile) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        if (!('name' in JSON.parse(fileReader.result)) ||
          !('thumbnail' in JSON.parse(fileReader.result)) ||
          !('questions' in JSON.parse(fileReader.result))) {
          throw Error();
        } else {
          setEditQuizName(JSON.parse(fileReader.result).name);
          setEditQuizThumbnail(JSON.parse(fileReader.result).thumbnail);
          setEditQuizQuestions(JSON.parse(fileReader.result).questions);
          setErrorMessage(null)
        }
      } catch (error) {
        setErrorMessage('Not valid JSON file or a game file! Please check you have uploaded the correct game file!');
        handleOpen();
      }
    }
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  }

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
            <>{errorMessage}</>
            </Typography>
            <Button variant="contained" onClick={handleClose}>Close</Button>
          </Box>
        </Fade>
        </div>
      </Modal>
      {
        <>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            Import Quiz: <input type='file' name='importQuiz' onChange={(e) => uploadGame(e.target.files)}></input><br />
          </Typography>
        </>
      }
    </>
  )
}

export default UploadNewQuiz;
