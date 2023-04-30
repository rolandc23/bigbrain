import React from 'react';
import API from '../api';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';

/*
IndividualResult
Handles the player's result page
*/
function IndividualResult () {
  const playerId = useParams().playerId;
  const [results, setResults] = React.useState(null);

  // Gets the player's visible results
  // The player does not see all details
  // of their results as it is shown on admin results page
  React.useEffect(async () => {
    try {
      const response = await API.get(`play/${playerId}/results`)
      setResults(response.data);
    } catch (Error) {
      console.log(Error);
    }
  }, [])

  return (
    <section>
    { (results)
      ? results.map((question, index) => (
      <div key={index}>
        <Typography variant="h5">
          Question {index + 1}: <br />
        </Typography>
        <Typography variant="body1">
          Answered in {(new Date(question.answeredAt) - new Date(question.questionStartedAt)) / 1000}s, {question.correct ? <>correct</> : <>incorrect</>} with answer(s): {question.answerIds.map((id) => (String.fromCharCode(65 + id) + ' '))}
        </Typography>
        <hr/>
        <br />
        <br />
      </div>
      ))
      : <Typography variant="h5" align='center'>No results to show</Typography>
    }
    </section>
  )
}

export default IndividualResult;
