import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { theme } from '../styles/styles';
import { ThemeProvider } from '@mui/material';

const style = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const Alert = (props) => {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleIt = () => {
    handleClose();
    props.toggleModal();
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Modal
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
        >
          <Box sx={style}>
            <Typography variant='h3' color='primary'>
              Error Alert
            </Typography>
            <Typography sx={{ mt: 2, mb: 2 }}>
              {props.msg}
            </Typography>
            <Button variant='contained' color='neutral' onClick={toggleIt}>CLOSE</Button>
          </Box>
        </Modal>
      </ThemeProvider>
    </div>
  );
}

Alert.propTypes = {
  msg: PropTypes.string,
  toggleModal: PropTypes.func
}
