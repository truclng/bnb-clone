import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, ThemeProvider } from '@mui/material';
import { theme } from '../styles/styles';
import { makeRequest } from '../helpers/helpers';
import { Alert } from './Alert';

export const BookingCard = (props) => {
  const id = props.id;
  const [status, setStatus] = React.useState(props.status);

  const [openAlert, setOpenAlert] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const refetchBookings = async () => {
    const res = await makeRequest('bookings', 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      const allBookings = res.bookings;
      const matches = allBookings.filter((booking) => booking.listingId === props.listingId);
      // Ensure that pending bookings appear on top of the list
      matches.forEach((booking) => {
        if (booking.status === 'pending') {
          const idx = matches.indexOf(booking);
          matches.splice(idx, 1);
          matches.unshift(booking);
        }
      });
      props.setBookings(matches);
    }
  }

  const acceptRequest = async () => {
    const res = await makeRequest(`bookings/accept/${id}`, 'PUT');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      setStatus('accepted');
      refetchBookings();
    }
  }

  const rejectRequest = async () => {
    const res = await makeRequest(`bookings/decline/${id}`, 'PUT');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      setStatus('declined');
      refetchBookings();
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Card sx={ { display: 'flex', justifyContent: 'space-between', maxWidth: 700, mt: 2, border: '1px solid black' } }>
        <Box sx={ { display: 'flex', flexDirection: 'column' } }>
          <CardContent>
            <Typography component='div' variant='h5'>
              Date Range
            </Typography>
            <Typography component='div' variant='body1' color='gray'>
              From: {props.dateFrom}
            </Typography>
            <Typography component='div' variant='body1' color='gray'>
              To: {props.dateTo}
            </Typography>
          </CardContent>
        </Box>
        <Box sx={ { display: 'flex', flexDirection: 'column', pl: 1 } }>
          <CardContent>
            <Typography component='div' variant='h5'>
              Price
            </Typography>
            <Typography component='div' variant='body1' color='gray'>
              $ {props.price}
            </Typography>
          </CardContent>
        </Box>
        <Box sx={ { display: 'flex', flexDirection: 'column', pl: 1 } }>
          <CardContent>
            <Typography component='div' variant='h5'>
              Status
            </Typography>
            {status === 'accepted' && (
              <Typography component='div' variant='body1' color='secondary'>
                Accepted
              </Typography>
            )}
            {status === 'declined' && (
              <Typography component='div' variant='body1' color='primary'>
                Declined
              </Typography>
            )}
            {status === 'pending' && (
              <Typography component='div' variant='body1' color='gray'>
                Pending
              </Typography>
            )}
          </CardContent>
        </Box>
        <Box sx={ { display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: 3 } }>
          <Button
            color='primary'
            variant='contained'
            disabled={status !== 'pending'}
            sx={ { mb: 2 } }
            onClick={acceptRequest}
          >
            ACCEPT
          </Button>
          <Button
            color='neutral'
            variant='contained'
            disabled={status !== 'pending'}
            onClick={rejectRequest}
          >
            REJECT
          </Button>
        </Box>
      </Card>
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </ThemeProvider>
  );
}

BookingCard.propTypes = {
  dateFrom: PropTypes.string,
  dateTo: PropTypes.string,
  price: PropTypes.number,
  status: PropTypes.string,
  id: PropTypes.number,
  setBookings: PropTypes.func,
  listingId: PropTypes.number,
}
