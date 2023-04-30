import API from '../api';

// Advances the quiz
async function advanceQuiz (quizId, token) {
  try {
    await API.post(`admin/quiz/${quizId}/advance`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    console.log('going next question');
  } catch (Error) {
    console.log(Error);
  }
}

export default advanceQuiz;
