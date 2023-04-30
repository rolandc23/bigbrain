import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import AllQuestionsContainer from '../styles/AllQuestionsContainer';

/*
QuestionList
Handles the question list in the editquestion page
Only shows the questions as editing a question requires
navigation to another page first.
*/
function QuestionList ({ editQuizQuestions, setEditQuizQuestions }) {
  const quizId = useParams().quizId;
  const navigate = useNavigate();
  function removeQuestion (index) {
    let questionCopy = editQuizQuestions;
    questionCopy = questionCopy.filter(question => question !== questionCopy[index]);
    questionCopy.map((question, index) =>
      (question.id = index)
    );
    setEditQuizQuestions(questionCopy);
  }

  // Moves to the question the user wants to edit
  function doEditQuestion (index) {
    navigate(`/editquiz/${quizId}/${index}`);
  }

  return (
    <AllQuestionsContainer>
    {editQuizQuestions.map((question, index) => (
      <div key={index}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '2px solid #e0dfdc',
            borderRadius: '10px',
            padding: '0px 50px 0px 50px',
            marginBottom: '5px',
            width: '260px',
            height: '620px'
          }}
        >
        <hr />
        <Typography variant="h5" align="center">
          Question {index + 1}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            height: '520px'
          }}
        >
        <Typography variant="body1" align="left">
          <br />Question: {question.string}<br />
          Duration: {question.duration} seconds<br />
          Points: {question.points}<br />
        </Typography>
        <Typography variant="body1" align="center">
            {(question.uploadType === 'uploadImage')
              ? <>Media Upload: <br /><img alt='Image provided as context for this question' src={question.mediaUpload} height='100' width='100'></img><br /></>
              : (question.uploadType === 'uploadVideo' || question.uploadType === 'embed')
                  ? (<>Media Upload: <br /><iframe
                    alt='Video provided as context for this question'
                    width="250"
                    height="150"
                    src={question.mediaUpload}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                  /><br /></>)
                  : <></>
            }
          </Typography>
          <br />
          <Typography variant="body1" align="left">
            A: {question.options[0]} {question.correctAnswers.A && <b>(Correct Answer)</b>}<br />
            B: {question.options[1]} {question.correctAnswers.B && <b>(Correct Answer)</b>}<br />
            {question.numOptions >= 3 && (
              <>
                C: {question.options[2]} {question.correctAnswers.C && <b>(Correct Answer)</b>}<br />
              </>
            )}
            {question.numOptions >= 4 && (
              <>
                D: {question.options[3]} {question.correctAnswers.D && <b>(Correct Answer)</b>}<br />
              </>
            )}
            {question.numOptions >= 5 && (
              <>
                E: {question.options[4]} {question.correctAnswers.E && <b>(Correct Answer)</b>}<br />
              </>
            )}
            {question.numOptions >= 6 && (
              <>
                F: {question.options[5]} {question.correctAnswers.F && <b>(Correct Answer)</b>}<br />
              </>
            )}
          </Typography>
        <ButtonGroup orientation="vertical" variant="text" aria-label="text button group">
          <Button size="small" variant="outlined" name={`editQuestion-${index}`} onClick={() => doEditQuestion(index)}>Edit Question {index + 1}</Button>
          <Button size="small" variant="outlined" name={`removeQuestionBtn-${index}`} onClick={() => removeQuestion(index)}>Delete Question</Button>
        </ButtonGroup>
        </Box>

          <br />
          </Box>
        </div>
    )
    )}
    </AllQuestionsContainer>
  )
}

export default QuestionList;
