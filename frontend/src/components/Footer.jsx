import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import footerStyle from '../styles/footerStyle';

/*
Places a footer with the group name at the
bottom of the page
*/
const Footer = () => {
  return (
    <footer style={footerStyle}>
      <Box
        sx={{
          backgroundColor: 'lightgray',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '0px',
          '& > *': {
            m: 1,
          },
        }}
      >
        <Typography variant="body1" align="center">ASS4LOAMESS.inc</Typography>
      </Box>
    </footer>
  );
};

export default Footer;
