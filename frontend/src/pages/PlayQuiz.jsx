import React from 'react';
import API from '../api';
import useInterval from '../helpers/useInterval';
import { useNavigate, useParams } from 'react-router-dom';
import Aimlab from '../components/Aimlab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/*
PlayQuiz
Handles the player's ability to play the quiz
Also acts as the lobby screen for the player with the minigame
*/
function PlayQuiz () {
  const playerId = useParams().playerId;
  const navigate = useNavigate();
  const [started, setStarted] = React.useState(false);
  const [question, setQuestion] = React.useState(null);
  const [timer, setTimer] = React.useState();
  const [sessionLastQuestionStart, setSessionLastQuestionStart] = React.useState();
  const [answerAvailable, setAnswerAvailable] = React.useState(false);
  const [realAnswerArray, setRealAnswerArray] = React.useState([]);
  const [singleAns, setSingleAns] = React.useState();
  const [answerArray, setAnswerArray] = React.useState([]);
  const [questionId, setQuestionId] = React.useState();
  const firstUpdate = React.useRef(true);

  const list = [...Array(6).keys()];
  const checkboxRef = list.map(x => React.useRef(null));

  // Handles the countdown timer
  const countDown = () => {
    const difference = +new Date(sessionLastQuestionStart) + timer - +new Date();
    const timeLeft = (difference / 1000);
    return timeLeft;
  };
  const [timeRemaining, setTimeRemaining] = React.useState(countDown());

  useInterval(() => {
    setTimeRemaining(countDown());
    getRealAnswerArray();
    getResults();
  }, 900)

  // Creates the answer array
  async function getRealAnswerArray () {
    try {
      const response = await API.get(`play/${playerId}/answer`,
        {}
      )
      setAnswerAvailable(true);
      setRealAnswerArray(response.data.answerIds);
    } catch (error) {
      setAnswerAvailable(false);
      console.log(error);
    }
  }

  // Gets the player results when the game
  // is finished
  async function getResults () {
    try {
      await API.get(`play/${playerId}/results`,
        {}
      )
      navigate(`/results/${playerId}`)
    } catch (error) {
      console.log(error);
    }
  }

  // Polls the current player status
  useInterval(async () => {
    if (started) return;
    try {
      const response = await API.get(`play/${playerId}/status`,
        {}
      )
      setStarted(response.data.started);
    } catch (error) {
      console.log(error);
    }
  }, 1000)

  // Polls the current question to know when the quiz has advanced
  React.useEffect(() => {
    if (!started) return
    let controller = new AbortController();
    (async () => {
      let timeOutId = setTimeout(async () => {
        try {
          const response = await API.get(`play/${playerId}/question`,
            {
              signal: controller.signal
            }
          )
          setQuestion(response.data.question);
          setSessionLastQuestionStart(response.data.question.isoTimeLastQuestionStarted);
          if (questionId !== response.data.question.id) {
            setQuestionId(response.data.question.id)
            setAnswerAvailable(false);
            setSingleAns();
            setAnswerArray([]);
            checkboxRef.map((ele) => {
              ele.current.checked = false;
              return checkboxRef;
            })
          }
        } catch (error) {
          console.log(error);
        }
        timeOutId = null;
        controller = null;
      }, 100)
      return () => clearTimeout(timeOutId);
    })();
    return () => controller?.abort();
  }, [timeRemaining, started])

  React.useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const timeOutId = setTimeout(async () => {
      setTimer(question.duration * 1000);
    }, 100)
    return () => clearTimeout(timeOutId);
  }, [question])

  // Updates the answer array
  function updateArray () {
    const timeOutId = setTimeout(() => {
      const submissionArray = []
      checkboxRef.map((ele, index) => {
        if (ele.current?.checked) submissionArray.push(index);
        return checkboxRef;
      })
      setAnswerArray(submissionArray);
    }, 100)
    return () => clearTimeout(timeOutId);
  }

  // Submits a player's answer
  React.useEffect(async () => {
    try {
      await API.put(`play/${playerId}/answer`,
        {
          answerIds: answerArray
        }
      )
    } catch (error) {
      console.log(error);
    }
  }, [answerArray])

  function doSelectSingle (ansId) {
    setSingleAns(ansId)
    updateArray();
  }

  return (
    <main>
    {(answerAvailable)
      ? <section>
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
      <Typography variant="body1" align="center">
        Correct answers were:
          {realAnswerArray.includes(0) && <> A </>}
          {realAnswerArray.includes(1) && <> B </>}
          {realAnswerArray.includes(2) && <> C </>}
          {realAnswerArray.includes(3) && <> D </>}
          {realAnswerArray.includes(4) && <> E </>}
          {realAnswerArray.includes(5) && <> F </>}
      </Typography>
      </Box>
      </Box>
      </section>
      : (started && question)
          ? <section>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '30px'
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
            <Typography variant="body1" align="center">
            <br /><b>Question: {question.question}</b><br />
            <>Type: {question.type === 'singleAnswer'
              ? <>Single Answer</>
              : <>Multiple Answers</>
            }</><br />
            <>Timer: {timeRemaining > 0 ? Math.round(timeRemaining) : 0}</><br />
            {(question.uploadType === 'uploadImage')
              ? <>Image: <br /><img alt='Image provided as context for this question' src={question.mediaUpload} height='100' width='100'></img><br /></>
              : (question.uploadType === 'uploadVideo' || question.uploadType === 'embed')
                  ? <>Video: <br />
                    <iframe
                      alt='Video provided as context for this question'
                      width="500"
                      height="300"
                      src={question.mediaUpload}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded youtube"
                    /><br /></>
                  : <></>
            }
            <Typography variant="body1" align="left">
            {question.type === 'multiAnswer'
              ? <section>
                <><input type='checkbox' ref={checkboxRef[0]} onClick={() => updateArray()}></input> {question.options[0]}</><br />
                <><input type='checkbox' ref={checkboxRef[1]} onClick={() => updateArray()}></input> {question.options[1]}</><br />
                {question.numOptions >= 3 && <><input type='checkbox' ref={checkboxRef[2]} onClick={() => updateArray()}></input> {question.options[2]}<br /></>}
                {question.numOptions >= 4 && <><input type='checkbox' ref={checkboxRef[3]} onClick={() => updateArray()}></input> {question.options[3]}<br /></>}
                {question.numOptions >= 5 && <><input type='checkbox' ref={checkboxRef[4]} onClick={() => updateArray()}></input> {question.options[4]}<br /></>}
                {question.numOptions >= 6 && <><input type='checkbox' ref={checkboxRef[5]} onClick={() => updateArray()}></input> {question.options[5]} <br /></>}
              </section>
              : <section>
                <><input type='checkbox' ref={checkboxRef[0]} checked={singleAns === 0} onClick={() => doSelectSingle(0)}></input> {question.options[0]}</><br />
                <><input type='checkbox' ref={checkboxRef[1]} checked={singleAns === 1} onClick={() => doSelectSingle(1)}></input> {question.options[1]}</><br />
                {question.numOptions >= 3 && <><input type='checkbox' ref={checkboxRef[2]} checked={singleAns === 2} onClick={() => doSelectSingle(2)}></input> {question.options[2]}<br /></>}
                {question.numOptions >= 4 && <><input type='checkbox' ref={checkboxRef[3]} checked={singleAns === 3} onClick={() => doSelectSingle(3)}></input> {question.options[3]}<br /></>}
                {question.numOptions >= 5 && <><input type='checkbox' ref={checkboxRef[4]} checked={singleAns === 4} onClick={() => doSelectSingle(4)}></input> {question.options[4]}<br /></>}
                {question.numOptions >= 6 && <><input type='checkbox' ref={checkboxRef[5]} checked={singleAns === 5} onClick={() => doSelectSingle(5)}></input> {question.options[5]} <br /></>}
              </section>
            }
            </Typography>
            </Typography>
            </Box>
            </Box>
            </section>
          : <>
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
              <br /><b>Waiting lobby</b><br />
            </Typography>
            <br />
            <Typography variant="body1" align="center">
              <b>Remember: </b>Points are given based on how fast you answer relative to the question duration! (minimum at 50% of maximum points)<br /><br />
              <b>For example: </b>A 1000 point question with 10 second duration answered in 2 seconds will give 800 pts! Same question answered in 8 seconds will give 500 pts<br /><br />
              <b>Question Type:</b> For single answer questions, only one option can be selected. For multiple answer questions, players need to select all possible correct answers for them to get all the points, all or nothing.<br /><br />
            </Typography>
            </Box>
            </Box>
            </section>
            <br />
            <section>
            <Typography variant="h6" align="center">
              <b>Lobby Minigame</b>
            </Typography>
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
                  marginBottom: '30px',
                  border: '2px solid #e0dfdc',
                  borderRadius: '10px',
                  padding: '5px 50px 5px 50px'
                }}
              >
                <Aimlab></Aimlab>
              </Box>
            </Box>
            </section>
            </>
          }
    </main>
  )
}

export default PlayQuiz;
