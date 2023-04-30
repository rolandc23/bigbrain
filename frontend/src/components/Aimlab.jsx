import React from 'react';
import AimlabContainer from '../styles/AimlabContainerStyles';
import useInterval from '../helpers/useInterval';
import Modal from '@mui/material/Modal';
import modalStyle from '../styles/modalStyle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

/*
Aimlab
Handles the functionality of the lobby circle clicking minigame
Provides players something to do while waiting for the players to join
the game session, and waiting for the admin to start the session
*/
function Aimlab () {
  const [xPos, setXPos] = React.useState(window.innerWidth / 4);
  const [yPos, setYPos] = React.useState(window.innerHeight / 4);
  const [started, setStarted] = React.useState(false);
  const [timeStarted, setTimeStarted] = React.useState();
  const [size, setSize] = React.useState(1);

  const [open, setOpen] = React.useState(false);
  const [openInstruction, setOpenInstruction] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenInstruction = () => setOpenInstruction(true);
  const handleCloseInstruction = () => setOpenInstruction(false);

  // Minigame
  const [minigamePoints, setMinigamePoints] = React.useState(0);
  const [highscore, setHighscore] = React.useState(0);

  // Handles the calculation of the count down timer
  const countDown = () => {
    if (!started) return 30;
    const difference = +timeStarted + 30000 - +new Date();
    const timeLeft = Math.round(difference / 1000);
    return timeLeft;
  };
  const [timeRemaining, setTimeRemaining] = React.useState(countDown());

  // Opens the minigame results modal when the timer is up
  useInterval(() => {
    if (timeRemaining <= 0) {
      setTimeRemaining(30);
      handleOpen();
      setStarted(false);
      return;
    }
    setTimeRemaining(countDown());
  }, 200)

  // Sets the visible highscore if
  // a new highscore is achieved
  React.useEffect(() => {
    if (minigamePoints > highscore) setHighscore(minigamePoints);
  }, [minigamePoints])

  // Creates a random position (for the circle)
  function getRandomPosition () {
    setXPos(Math.random() * (window.innerWidth - 150) / 2.5);
    setYPos(Math.random() * (window.innerHeight - 150) / 2.5);
    setMinigamePoints(0);
    setSize(1);
  }

  // Moves the button when it is clicked, and
  // makes it slightly smaller each consecutive click
  function buttonClicked (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      return;
    }
    setXPos(Math.random() * (window.innerWidth - 150) / 2.5);
    setYPos(Math.random() * (window.innerHeight - 150) / 2.5);
    setMinigamePoints(minigamePoints + 1);
    setSize(0.95 * size);
    e.cancelBubble = true;
    e.stopPropagation();
  }

  // Starts the game
  function doStart () {
    setXPos(window.innerWidth / 4);
    setYPos(window.innerHeight / 4);
    setSize(1);
    setMinigamePoints(0);
    setTimeStarted(new Date());
    setStarted(true);
  }

  // Keyboard users settle down (otherwise you can get big score :c)
  function enterHack (e) {
    e.preventDefault();
  }

  return (
    <>{open &&
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      role="alert"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      >
      <div>
      <Fade in={open}>
        <Box sx={modalStyle}>
          <Typography id="Minigame Finished" variant="h5" >
            <b>Finished!</b>
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            You scored: {minigamePoints}<br />
            {minigamePoints === highscore && <>well done, you hit a new highscore!!!</>}<br />
          </Typography>
          <Button variant="contained" data-testid="closeScoreModal" onClick={handleClose}>Close</Button>
        </Box>
      </Fade>
      </div>
      </Modal>
    }
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      role="alert"
      open={openInstruction}
      onClose={handleCloseInstruction}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      >
      <div>
      <Fade in={openInstruction}>
        <Box sx={modalStyle}>
        <Typography variant="h6" align="center">Instructions</Typography>
        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
          A small, black button will appear on the screen once the game has been started. This button will move somewhere else once you have clicked it, adding 1 to your score in the process. The goal of the game is to click this button as many times as possible before time runs out. Be careful however, if you miss the button, your score will reset to 0. You have 30 seconds, good luck!
        </Typography>
        <br /><br />
        <Button variant="contained" data-testid='closeInstruction' onClick={handleCloseInstruction}>Close</Button>
        </Box>
      </Fade>
      </div>
      </Modal>
      <Typography role="timer" variant="body1" align="center">
      <br />
      Score: <span data-testid='score'>{minigamePoints}</span><br/>
      Highscore: <span data-testid='highscore'>{highscore}</span><br />
      Timer: {!started && timeRemaining < 0 ? 30 : <>{ timeRemaining }</>} seconds<br /><br />
      <Button size="small" variant="outlined" data-testid="openInstructions" onClick={handleOpenInstruction}>Show Instructions</Button><br />
      </Typography>
      <br />
      <Button size="small" variant="outlined" onClick={() => doStart()}>Start</Button><br />
      <AimlabContainer data-testid='container' onClick={() => getRandomPosition()}>
        {started &&
          <button
          type="button"
          onClick={(e) => buttonClicked(e)}
          onKeyDown={(e) => enterHack(e)}
          style={{
            backgroundColor: 'black',
            color: 'white',
            fontSize: `${12 * size}px`,
            height: `${70 * size}px`,
            width: `${70 * size}px`,
            borderRadius: '50%',
            position: 'absolute',
            top: `${35 + yPos}px`,
            right: `${35 + xPos}px`,
            padding: '0'
          }}>
          Click Me!
        </button>
        }
      </AimlabContainer>
    </>
  );
}

export default Aimlab;
