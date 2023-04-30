import React from 'react';
import API from '../api'
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import modalStyle from '../styles/modalStyle';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorText from '../styles/ErrorText';

/*
RegForm
Handles the page for the registration form
*/
const RegForm = () => {
  const [regEmail, setRegEmail] = React.useState('');
  const [regPw, setRegPw] = React.useState('');
  const [regConfirmPw, setRegConfirmPw] = React.useState('');
  const [regName, setRegName] = React.useState('');

  const [invalidEmail, setInvalidEmail] = React.useState(false);
  const [invalidPw, setInvalidPw] = React.useState('');
  const [invalidConfirmPw, setInvalidConfirmPw] = React.useState('');
  const [invalidName, setInvalidName] = React.useState('');

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [disabled, setDisabled] = React.useState(true);

  // Registers a user, stores their details in localstorage
  // and navigates to dashboard page
  async function register () {
    try {
      const response = await API.post('admin/auth/register',
        {
          email: regEmail,
          password: regPw,
          name: regName
        }
      )
      localStorage.setItem('token', JSON.stringify(response.data));
      localStorage.setItem('email', regEmail);
      navigate('/dashboard')
    } catch (error) {
      handleOpen();
    }
  }

  // Checks if an email is valid email structure
  function checkEmail () {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;
    setInvalidEmail(!regEmail.match(validRegex));
    return (regEmail.match(validRegex));
  }

  // Checks if a name is of valid length
  function checkName () {
    if (regName.length < 2) {
      setInvalidName('Name must be longer than 1 character!')
    } else if (regName.length > 99) {
      setInvalidName('Name must be shorter than 100 characters!')
    } else {
      setInvalidName('');
    }
    return (regName.length >= 2 && regName.length <= 99);
  }

  // Checks if a password is of valid length
  function checkPw () {
    if (regPw.length < 6) {
      setInvalidPw('Password must be 6 characters or longer!');
    } else {
      setInvalidPw('');
    }
    return (regPw.length >= 6);
  }

  // Checks if the confirmed password is same as password
  function checkConfirmPw () {
    if (regPw !== regConfirmPw) {
      setInvalidConfirmPw('Passwords are not matching!')
    } else {
      setInvalidConfirmPw('');
    }
    return (regPw === regConfirmPw);
  }

  // Checks if any of the error cases occured, disables the button
  // if any errors are found
  function regRender () {
    const validEmail = checkEmail();
    const validName = checkName();
    const validPw = checkPw();
    const validConfirm = checkConfirmPw();
    setDisabled(!(validEmail && validName && validPw && validConfirm));
  }

  const firstUpdate = React.useRef(true);
  React.useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const timeOutId = setTimeout(() => regRender(), 100);
    return () => clearTimeout(timeOutId);
  }, [regName, regPw, regConfirmPw, regEmail]);

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
            <>Email is already taken! Please try again with a different email, or try logging in instead.</>
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
        data-testid='email'
        name='regEmail'
        label="Email"
        defaultValue={regEmail}
        onChange={(e) => { setRegEmail(e.target.value) }}
      />
      {invalidEmail && (<ErrorText role='alert'>{'Email is not valid! An example of a valid email would be james@email'}<br /></ErrorText>)}
      <TextField
        required
        data-testid='name'
        name='regName'
        label="Name"
        defaultValue={regName}
        onChange={(e) => { setRegName(e.target.value) }}
      />
      {invalidName && (<ErrorText role='alert'>{invalidName}<br /></ErrorText>)}
      <TextField
        id='password'
        data-testid='password'
        name='regPw'
        label="Password"
        type="password"
        autoComplete="current-password"
        defaultValue={regPw}
        onChange={(e) => { setRegPw(e.target.value) }}
      />
      {invalidPw && (<ErrorText role='alert'>{invalidPw}<br /></ErrorText>)}
      <TextField
        id='confirmPassword'
        data-testid='confirmPassword'
        name='regConfirmPw'
        label="Password"
        type="password"
        autoComplete="current-password"
        defaultValue={regConfirmPw}
        onChange={(e) => { setRegConfirmPw(e.target.value) }}
      />
      {invalidConfirmPw && (<ErrorText role='alert'>{invalidConfirmPw}<br /></ErrorText>)}
      <Button variant="outlined" name='regSubmitBtn' onClick={register} disabled={disabled}>Register</Button>
      </Box>
    </section>
  )
}

export default RegForm;
