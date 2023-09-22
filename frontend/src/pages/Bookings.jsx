import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button, Box, Typography, ThemeProvider } from '@mui/material';
import { theme } from '../styles/styles';
import { makeRequest } from '../helpers/helpers';
import { BookingCard } from '../components/BookingCard';
import { NavBar } from '../components/homeNavBar';
import { BookingHistory } from '../components/BookingHistory';

export const Bookings = () => {
  const [isHomePage, setHomePage] = React.useState(false);
  const listingId = useParams().id;
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');

  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const returnToHostings = () => {
    navigate('/hostings');
  }

  const [listingTitle, setListingTitle] = React.useState('');
  const [listingPostedDate, setPostedDate] = React.useState('');
  const getListingDetails = async () => {
    const res = await makeRequest(`listings/${listingId}`, 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      const listing = res.listing;
      setListingTitle(listing.title);
      setPostedDate(listing.postedOn);
    }
  }

  const [tabTitle, setTabTitle] = React.useState('Bookings');
  const handleTabChange = (event, newTitle) => {
    setTabTitle(newTitle);
  }

  const [bookings, setBookings] = React.useState([]);

  const getBookings = async () => {
    const res = await makeRequest('bookings', 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      const allBookings = res.bookings;
      const matches = allBookings.filter((booking) => booking.listingId === listingId);
      // Ensure that pending bookings appear on top of the list
      matches.forEach((booking) => {
        if (booking.status === 'pending') {
          const idx = matches.indexOf(booking);
          matches.splice(idx, 1);
          matches.unshift(booking);
        }
      });
      setBookings(matches);
    }
  }

  React.useEffect(() => {
    getBookings();
    getListingDetails();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavBar isHome={isHomePage} setHome={setHomePage} />
      <Box sx={ { m: 2 } }>
        <Button
          color='neutral'
          variant='outlined'
          sx= { { m: 2 } }
          onClick={returnToHostings}
        >
          RETURN
        </Button>
        <Typography variant='h2' sx={ { m: 2 } }>
          {listingTitle}
        </Typography>
        <Box sx={ { width: '100%' } }>
          <Tabs
            value={tabTitle}
            onChange={handleTabChange}
            textColor='primary'
            indicatorColor='primary'
            aria-label='Bookings page tab panel'
          >
            <Tab value='Bookings' label='Bookings' />
            <Tab value='History' label='History' />
          </Tabs>
        </Box>
        {tabTitle === 'Bookings' && (
          bookings.map((booking) => {
            return (
              <BookingCard key={booking.id} dateFrom={booking.dateRange.start} dateTo={booking.dateRange.end}
                price={booking.totalPrice} status={booking.status} id={booking.id} listingId={listingId} setBookings={setBookings} />
            );
          })
        )}
        {tabTitle === 'History' && (
          <BookingHistory postedDate={listingPostedDate} bookings={bookings} />
        )}
      </Box>
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </ThemeProvider>
  );
}
