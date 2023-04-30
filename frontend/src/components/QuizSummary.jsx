import React from 'react';
import getToken from '../helpers/getToken'
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import LineChart from '../components/LineChart';
import Leaderboard from './Leaderboard';
import Typography from '@mui/material/Typography';

Chart.register(CategoryScale);

/*
QuizSummary
Handles the admin page of a quiz session's results
*/
function QuizSummary () {
  const sessionId = useParams().sessionId;
  const token = getToken();
  const quizId = useParams().quizId;
  const [quizResults, setQuizResults] = React.useState(null);
  const [questions, setQuestions] = React.useState(null);
  const [topPlayers, setTopPlayers] = React.useState(null);
  const [allPlayers, setAllPlayers] = React.useState(null);
  const [numPlayers, setNumPlayers] = React.useState();
  const [quizAnalysis, setQuizAnalysis] = React.useState();
  const [updatedResults, setUpdatedResults] = React.useState(null);

  const navigate = useNavigate();

  // For the graph
  const [correctAnswerData, setCorrectAnswerData] = React.useState(null)
  const [timeTakenData, setTimeTakenData] = React.useState(null);

  // Gets the results details from API call
  // and sets necessary values
  React.useEffect(async () => {
    try {
      const response = await API.get(`admin/session/${sessionId}/results`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setQuizResults(response.data.results);
      setNumPlayers(response.data.results.length);
      const response1 = await API.get(`admin/quiz/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setQuestions(response1.data.questions);
    } catch (Error) {
      alert('Session ID provided no longer exists');
      navigate('/dashboard');
    }
  }, [])

  // Calculates each player's points based on
  // The (time they took to answer)/(total question duration) as
  // a percentage, with a minimum of 50% of max points
  const firstUpdate = React.useRef(true);
  React.useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const analysis = [];
    const newResults = quizResults;
    for (let i = 0; i < newResults.length; i++) {
      let points = 0;
      for (let j = 0; j < newResults[i].answers.length; j++) {
        const questionStart = new Date(newResults[i].answers[j].questionStartedAt);
        const answered = new Date(newResults[i].answers[j].answeredAt);
        if (newResults[i].answers[j].correct) {
          const percentage = ((questions[j].duration * 1000) - (answered - questionStart)) / (questions[j].duration * 1000)
          points += Math.max(0.5 * questions[j].points, percentage * questions[j].points);
        }
      }
      newResults[i].totalPoints = points;
    }

    // Calculates result values to
    // show in the overall analysis
    for (let i = 0; i < questions.length; i++) {
      const questionAnalysis = {
        questionNum: i + 1,
        timeTaken: 0,
        numCorrect: 0
      }
      for (let j = 0; j < numPlayers; j++) {
        const questionStart = new Date(newResults[j].answers[i].questionStartedAt);
        const answered = new Date(newResults[j].answers[i].answeredAt);
        questionAnalysis.timeTaken += (answered - questionStart) / 1000;
        questionAnalysis.numCorrect += ((newResults[j].answers[i].correct) ? 1 : 0);
      }
      analysis.push(questionAnalysis);
    }
    setQuizAnalysis(analysis);

    // Shows the percentage of correctly answered users for a question
    setCorrectAnswerData({
      labels: analysis.map((data) => {
        return data.questionNum;
      }),
      datasets: [
        {
          label: 'Percentage correct',
          data: analysis.map((data) => (data.numCorrect * 100 / numPlayers)),
          backgroundColor: [
            'rgba(75,192,192,1)',
            '#50AF95',
            '#f3ba2f',
            '#2a71d0'
          ],
          borderColor: 'black',
          borderWidth: 2,
          width: '100px'
        }
      ]
    });

    // Shows the average time taken to answer for a question
    setTimeTakenData({
      labels: analysis.map((data) => {
        return data.questionNum;
      }),
      datasets: [
        {
          label: 'Average time taken',
          data: analysis.map((data) => (data.timeTaken / (numPlayers))),
          backgroundColor: [
            'rgba(75,192,192,1)',
            '#50AF95',
            '#f3ba2f',
            '#2a71d0'
          ],
          borderColor: 'black',
          borderWidth: 2
        }
      ]
    });
    setUpdatedResults(newResults.sort(compare));
  }, [questions]);

  // Compare function to use for sorting players
  // by their total points
  function compare (a, b) {
    const aPoints = a.totalPoints;
    const bPoints = b.totalPoints;
    return (bPoints > aPoints) ? 1 : -1;
  }

  // Gets the top 5 players
  const firstUpdate2 = React.useRef(true);
  React.useEffect(() => {
    if (firstUpdate2.current) {
      firstUpdate2.current = false;
      return;
    }
    const extractResults = updatedResults.map((player) => {
      return {
        name: player.name,
        points: player.totalPoints
      }
    })
    setTopPlayers(extractResults.slice(0, 5));
  }, [updatedResults]);

  const firstUpdate3 = React.useRef(true);
  React.useEffect(() => {
    if (firstUpdate3.current) {
      firstUpdate3.current = false;
      return;
    }
    const extractResults = updatedResults.map((player) => {
      return {
        name: player.name,
        points: player.totalPoints
      }
    })
    setTopPlayers(extractResults.slice(0, 5));
    setAllPlayers(extractResults);
  }, [updatedResults]);

  return (
    <>
      { (numPlayers > 0)
        ? <>
          <section>
            <Leaderboard topPlayers={topPlayers}/>
          </section>
          <hr />
          <section>
          <Typography variant='h5' align="center">
            Total Players: {numPlayers}
          </Typography><hr />
          { (allPlayers) && allPlayers.map((player, index) => (
            <div key={index + 'player'}><Typography variant='body1' align="left">{index + 1}: {player.name}</Typography></div>
          ))
          }
          </section>
          <section>
          <Typography variant='h5' align="center">
            Question by question analysis
          </Typography><hr />
          { (quizAnalysis) && quizAnalysis.map((question, index) => (
            <div key={index + 'hi'}>
            <Typography variant='h6' align="left">
              Question {index + 1}:
            </Typography><hr />
            <Typography variant='body1' align="left">
              Average Response Time: {(question.timeTaken / numPlayers).toFixed(3)} seconds <br />
              Percentage of those who answered correctly: {(question.numCorrect * 100 / numPlayers).toFixed(3)}%<br></br>
            </Typography><hr />
            </div>
          ))
          }
          </section>
          <section>
          { (correctAnswerData) && <><Typography variant='h5' align="center">Percentage of correct responses per question</Typography><LineChart chartData={correctAnswerData} title={''} yAxisTitle={'Percentage'} xAxisTitle={'Question No.'} /></>}
          { (timeTakenData) && <><Typography variant='h5' align="center">Average response time per question</Typography><LineChart chartData={timeTakenData} title={''} yAxisTitle={'Seconds'} xAxisTitle={'Question No.'} /></>}
          </section>
          <br />
          <br />
          </>
        : <Typography variant='h5' align='center'>No results to show :c</Typography>
      }
    </>
  )
}

export default QuizSummary;
