import React from 'react';
import API from '../api'
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import modalStyle from '../styles/modalStyle';

/*
LoginForm
Handles the login form for quiz admins
*/
const LoginForm = () => {
  const [logEmail, setLogEmail] = React.useState('');
  const [logPw, setLogPw] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const navigate = useNavigate();
  async function login () {
    try {
      const response = await API.post('admin/auth/login',
        {
          email: logEmail,
          password: logPw
        }
      )
      localStorage.setItem('token', JSON.stringify(response.data));
      navigate('/dashboard/')
    } catch (error) {
      handleOpen();
    }
  }

  const firstUpdate = React.useRef(true);
  React.useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const timeOutId = setTimeout(() => checkEmpty(), 100);
    return () => clearTimeout(timeOutId);
  }, [logEmail, logPw]);

  // Checks if the forms are empty, then shows an error modal
  function checkEmpty () {
    setDisabled(logEmail.length === 0 || logPw.length === 0);
  }
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <section>
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
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <>Email or password is incorrect! Please try again :c</>
            </Typography>
            <Button variant="contained" onClick={handleClose}>Close</Button>
          </Box>
        </Fade>
        </div>
      </Modal>

      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '40ch' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      noValidate
      autoComplete="off"
      >
      <TextField
        required
        data-testid="email"
        id="email"
        label="Email"
        defaultValue={logEmail}
        onChange={(e) => { setLogEmail(e.target.value) }}
      />
      <TextField
        id='password'
        data-testid="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        defaultValue={logPw}
        onChange={(e) => { setLogPw(e.target.value) }}
      />
      <Button variant="outlined" name='loginBtn' onClick={login} disabled={disabled}>Sign In</Button>
      </Box>
    </section>
  )
}

export default LoginForm;
