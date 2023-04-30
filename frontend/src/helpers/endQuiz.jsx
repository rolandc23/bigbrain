import API from '../api';

// Ends the quiz
async function endQuiz (quizId, token) {
  console.log(quizId)
  try {
    await API.post(`admin/quiz/${quizId}/end`,
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
}

export default endQuiz;
