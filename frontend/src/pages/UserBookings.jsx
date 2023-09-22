import React from 'react';
import { NavBar } from '../components/homeNavBar';
import { makeRequest, jwtDecode, getToken } from '../helpers/helpers';
import { Alert } from '../components/Alert';
import { Box, ThemeProvider, Typography } from '@mui/material';
import { theme } from '../styles/styles';
import { ViewBookingCard } from '../components/ViewBookingCard';

export const UserBookings = () => {
  const [isHomePage, setHomePage] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const [bookings, setBookings] = React.useState([]);

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

  React.useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavBar isHome={isHomePage} setHome={setHomePage} />
      <Box sx={ { m: 4 } }>
        <Typography variant='h2'>
          My Bookings
        </Typography>
        {bookings.map((booking, idx) => {
          return <ViewBookingCard title={booking[0]} imgUrl={booking[1].img} altText={booking[1].label.title}
            status={booking[4]} dateRange={booking[2]} price={booking[3]} id={booking[5]} setBookings={setBookings} key={idx} />
        })}
        {bookings.length === 0 && (
          <Typography variant='body1' sx={ { mt: 4 } }>You have not booked anything yet!</Typography>
        )}
      </Box>
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </ThemeProvider>
  );
}
