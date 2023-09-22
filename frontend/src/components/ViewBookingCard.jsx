import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, ThemeProvider } from '@mui/material';
import { theme } from '../styles/styles';
import { Alert } from '../components/Alert';
import { makeRequest, jwtDecode, getToken } from '../helpers/helpers';

export const ViewBookingCard = (
  { title, imgUrl, altText, status, dateRange, price, id, setBookings }
) => {
  const [openAlert, setOpenAlert] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const getListingDetails = async (id) => {
    const res = await makeRequest(`listings/${id}`, 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      const listing = res.listing;
      return [listing.title, listing.thumbnail];
    }
  }

  const getMatchingBookings = async (allBookings) => {
    const matches = [];
    for (const booking of allBookings) {
      if (booking.owner === jwtDecode(getToken())) {
        const info = await getListingDetails(booking.listingId);
        info.push(booking.dateRange, booking.totalPrice, booking.status, booking.id);
        matches.push(info);
      }
    }
    return matches;
  }

  const fetchBookings = async () => {
    const res = await makeRequest('bookings', 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      getMatchingBookings(res.bookings)
        .then((data) => {
          setBookings(data);
        });
    }
  }

  const removeBooking = async () => {
    const res = await makeRequest(`bookings/${id}`, 'DELETE');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      fetchBookings();
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={ { mt: 3 } }>
        <Card sx={ { maxWidth: 675, border: '1px solid black', textAlign: 'right' } }>
          <Box sx={ { display: 'flex', justifyContent: 'space-around', textAlign: 'left' } }>
            <CardMedia
              component='img'
              sx={ { maxWidth: 175, m: 2 } }
              image={imgUrl}
              alt={altText}
            />
            <Box sx={ { display: 'flex', direction: 'column', alignItems: 'flex-start' } }>
              <CardContent>
                <Typography component='div' variant='h3'>
                  {title}
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
            <Box sx={ { display: 'flex', direction: 'column', alignItems: 'flex-start' } }>
              <CardContent>
                <Typography component='div' variant='h5'>
                  Date Range
                </Typography>
                <Typography component='div' variant='body1' color='gray'>
                  From: {dateRange.start}
                </Typography>
                <Typography component='div' variant='body1' color='gray'>
                  To: {dateRange.end}
                </Typography>
              </CardContent>
            </Box>
            <Box sx={ { display: 'flex', direction: 'column', alignItems: 'flex-start' } }>
              <CardContent>
                <Typography component='div' variant='h5'>
                  Price
                </Typography>
                <Typography component='div' variant='body1' color='gray'>
                  $ {price}
                </Typography>
              </CardContent>
            </Box>
          </Box>
          <Button
            variant='contained'
            color='neutral'
            sx={ { m: 3 } }
            onClick={removeBooking}
          >
            Remove
          </Button>
        </Card>
      </Box>
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </ThemeProvider>
  );
}

ViewBookingCard.propTypes = {
  title: PropTypes.string,
  imgUrl: PropTypes.string,
  altText: PropTypes.string,
  status: PropTypes.string,
  dateRange: PropTypes.object,
  price: PropTypes.number,
  id: PropTypes.number,
  setBookings: PropTypes.func,
}
