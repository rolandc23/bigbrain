/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  // console.log('See question: ', question);
  return (
      {
        id: question.id,
        question: question.string,
        numOptions: question.numOptions,
        type: question.type,
        duration: question.duration,
        mediaUpload: question.mediaUpload,
        image: question.image,
        options: question.options,
        uploadType: question.uploadType
      }
    );
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const answerArray = []
  if (question.correctAnswers.A) answerArray.push(0);
  if (question.correctAnswers.B) answerArray.push(1);
  if (question.correctAnswers.C) answerArray.push(2);
  if (question.correctAnswers.D) answerArray.push(3);
  if (question.correctAnswers.E) answerArray.push(4);
  if (question.correctAnswers.F) answerArray.push(5);
  return answerArray;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  return [
    123,
    456,
    678,
  ]; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.duration;
};
