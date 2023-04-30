import styled from 'styled-components';

// Styling for quizzes container
const AllQuizzesContainer = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-auto-rows: 400px;
  grid-template-columns: repeat(auto-fill, 370px);
  gap: 10px;
  width: 100vw;
  padding-bottom: 30px;
`

export default AllQuizzesContainer;
