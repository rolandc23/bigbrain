import API from '../api';
import getToken from './getToken';

// Gets the quiz details given a quizid
async function getQuizDetails (quizId, controller) {
  const token = getToken();
  const response = await API.get(`admin/quiz/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    signal: controller.signal
  })
  const data = await response.data;
  return data;
}

export default getQuizDetails;
