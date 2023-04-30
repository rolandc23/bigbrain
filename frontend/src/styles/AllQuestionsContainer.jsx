import styled from 'styled-components';

// Style for the questions container
const AllQuestionsContainer = styled.div`
  display: inline-grid;
  justify-content: center;
  grid-auto-rows: 630px;
  grid-template-columns: repeat(auto-fill, 370px);
  gap: 10px;
  width: 100vw;
  padding-bottom: 30px;
`

export default AllQuestionsContainer;
