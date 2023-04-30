import React from 'react';
import getToken from '../helpers/getToken';
import API from '../api';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

/*
MakeNewQuiz
Creates a new form to create a default quiz with
*/
function MakeNewQuiz ({ newGameShow, setNewGameShow }) {
  const [disabled, setDisabled] = React.useState(true);
  const [newQuizName, setNewQuizName] = React.useState('');
  const token = getToken();
  React.useEffect(() => {
    const timeOutId = setTimeout(() => checkEmpty(), 100);
    return () => clearTimeout(timeOutId);
  }, [newQuizName]);

  // Checks if the given quiz name is empty
  function checkEmpty () {
    setDisabled(newQuizName.length === 0)
  }

  // Creates the new game with corresponding api call
  async function createNewGame () {
    try {
      await API.post('admin/quiz/new',
        {
          name: newQuizName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setNewGameShow(!newGameShow)
      setNewQuizName('');
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <Button size="small" style={{ marginBottom: '5px' }} variant="outlined" name='toggleNewGameForm' onClick={() => setNewGameShow(!newGameShow)}>
        {newGameShow ? 'Hide new game form' : 'Create new game'}
      </Button><br />
      {newGameShow && (
        <>
          <TextField
            required
            variant="standard"
            data-testid="newGameNameInput"
            name='newGameNameInput'
            label="New game name"
            defaultValue={newQuizName}
            onChange={(e) => { setNewQuizName(e.target.value) }}
          />
          <br /><br />
          <Button style={{ marginBottom: '5px', marginTop: '5px' }} variant="outlined" data-testid="createGameBtn" name='createGameBtn' onClick={createNewGame} disabled={disabled}>Create New Game</Button>
        </>
      )}
      <br />
      <br />
    </>
  )
}

export default MakeNewQuiz
