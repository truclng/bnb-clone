import React, { useState, useEffect } from 'react'
import { Box, Button, Card, Chip, FormControl, Stack, TextField, Typography, ThemeProvider } from '@mui/material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { getToken, jwtDecode, loggedIn, makeRequest } from '../helpers/helpers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { NavBar } from '../components/homeNavBar';
import { theme } from '../styles/styles';
import FiberManualRecordSharpIcon from '@mui/icons-material/FiberManualRecordSharp';
import GradeIcon from '@mui/icons-material/Grade';
import { ratingCalc } from '../helpers/listingHelpers';
import { ImageCarousel } from '../components/ImageCarousel';
import BedIcon from '@mui/icons-material/Bed';
import HotelIcon from '@mui/icons-material/Hotel';
import BathtubIcon from '@mui/icons-material/Bathtub';
import { ReviewModal } from '../components/ReviewModal';
import { BookingLabel } from '../components/BookingLabel';
import { Alert } from '../components/Alert';

const PricingBox = styled(Box)`
  display: flex;
  flex-direction: row;
`;

const DetailsBox = styled(Box)`
  display: '75vw';
  align-items: center;
  flex-direction: row;
`;

const ReviewBar = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1em 0;
`;

const StyledSpan = styled.span`
  display: flex;
  margin-top: 10px;
`;

const Root = styled.div`
  margin-left: 1em; 
  margin-right: 1em;
  margin-top: 1em;
`;

const HeaderBox = styled(Box)`
  display: 100vw; 
  flex-direction: row;
  flex-wrap: wrap;
`;

const AmenitiesBox = styled(Box)`
  display: 100vw; 
  flex-direction: row;
  flex-wrap: wrap;
  min-width: 350px;
  max-height: 200px;
  overflow: hidden;
  margin: 1em 0;
`;

export const Listing = () => {
  const id = useParams().id;
  const navigate = useNavigate();
  const [isHomePage, setHomePage] = useState(false);
  const [title, setTitle] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [price, setPrice] = useState(undefined);
  const [thumbnail, setThumbnail] = useState(undefined);
  const [propertyType, setPropertyType] = useState(undefined);
  const [bathrooms, setBathrooms] = useState(undefined);
  const [bedrooms, setBedrooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [bookings, setBookings] = useState(null)
  const [openAlert, setOpenAlert] = useState(false);
  const [availabilities, setAvailabilities] = useState([]);
  const [reviews, setReviews] = useState();
  const [owner, setOwner] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(0);
  const [doneBookings, setDoneBookings] = useState(false);
  const [listingId, setListingId] = useState(0);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q');

  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }

  const handleErrMsg = msg => {
    setErrMsg(msg);
  }

  function startFilled () {
    return setDisabled(start === null);
  }
  const calcDays = (start, end) => {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  }

  const submitBooking = async () => {
    const dateRange = { start: new Date(start).toLocaleString().split(',')[0], end: new Date(end).toLocaleString().split(',')[0] }
    const totalPrice = price * calcDays(new Date(start), new Date(end));
    const res = await makeRequest('bookings/new/' + id, 'POST', {
      dateRange,
      totalPrice
    });
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      setStart(null);
      setEnd(null);
      alert('Booking made successfully!');
      getBookings(id);
    }
  }

  const getListingDetails = async (id) => {
    const res = await makeRequest(`listings/${id}`, 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      setTitle(res.listing.title);
      setOwner(res.listing.owner);
      setAddress(res.listing.address);
      setPrice(res.listing.price);
      setThumbnail(res.listing.thumbnail);
      setPropertyType(res.listing.metadata.propertyType);
      setBathrooms(res.listing.metadata.bathrooms);
      setBedrooms(res.listing.metadata.bedrooms);
      setAmenities(res.listing.metadata.amenities);
      setAvailabilities(res.listing.availability);
      setPictures(res.listing.metadata.pictures);
      setReviews(res.listing.reviews);
      setListing(res.listing);
      setLoading(false);
    }
  }

  const handleBack = () => {
    navigate('/home');
  }

  const getBookings = async (id) => {
    const res = await makeRequest('bookings/', 'GET');
    const validBookings = [];
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      res.bookings.forEach((x) => {
        if (x.owner === jwtDecode(getToken()) && x.listingId === id) {
          validBookings.push(x)
        }
      })
      validBookings.forEach((booking) => {
        if (booking.status === 'accepted') {
          const idx = validBookings.indexOf(booking);
          validBookings.splice(idx, 1);
          validBookings.unshift(booking);
        }
      })
    }
    setBookings(validBookings);
    setDoneBookings(true);
  }

  const getNumberOfBeds = bedroomArray => {
    let count = 0;
    bedroomArray.forEach(function (x) {
      if (x.length !== 0) {
        x.forEach(function (y) {
          count = count + y.number;
        })
      }
    });
    return count;
  }

  useEffect(() => {
    setMinDate(start);
    startFilled();
  }, [start]);

  useEffect(() => {
    getListingDetails(id);
    if (getToken() !== null) {
      getBookings(id);
    } else {
      setDoneBookings(true);
    }
  }, []);

  useEffect(() => {
    if (bookings != null) {
      bookings.forEach((x) => {
        if (x.status === 'accepted') {
          setAccepted(x.id);
          setListingId(x.listingId);
        }
      })
    }
  }, [bookings]);

  useEffect(() => {
    if (getToken() !== null) {
      if (search !== null && (owner !== jwtDecode(getToken()))) {
        console.log(owner);
        setStart(search.split(' ')[0]);
        setEnd(search.split(' ')[1]);
      }
    } else {
      if (search !== null) {
        setStart(search.split(' ')[0]);
        setEnd(search.split(' ')[1]);
      }
    }
  }, [search, price, loading]);

  const handleStartDate = (value) => setStart(value);
  const handleEndDate = (value) => setEnd(value);

  const showMoreImages = () => {
    return (<ImageCarousel pictures={pictures}/>)
  }

  function getDatesInRange (startDate, endDate, allDays) {
    const startDateParts = startDate.split('/');
    const endDateParts = endDate.split('/');
    const startDateObject = new Date(+startDateParts[2], startDateParts[1] - 1, +startDateParts[0]);
    const endDateObject = new Date(+endDateParts[2], endDateParts[1] - 1, +endDateParts[0]);
    while (startDateObject <= endDateObject) { // eslint-disable-line no-unmodified-loop-condition
      allDays.push(new Date(startDateObject));
      startDateObject.setDate(startDateObject.getDate() + 1);
    }
    return allDays;
  }

  const disableBookedDays = (date) => {
    const allDays = []
    availabilities.map((x) => { // eslint-disable-line array-callback-return
      allDays.push(getDatesInRange(x.start, x.end, allDays))
    })
    const convertedIntoDateObject = allDays.map((bookedDate) => {
      return new Date(bookedDate).getTime();
    });
    return !convertedIntoDateObject.includes(new Date(date).getTime());
  };

  return (
    <>
      {/* <Chip label={'NO BOOKINGS'} sx={{ mt: 2, mr: 2 }}/> */}
      <Root>
      <NavBar isHome={isHomePage} setHome={setHomePage} />
      <ThemeProvider theme={theme}>
      {!loading && doneBookings && (<>
      <HeaderBox>
        <Typography variant='h1'> {title} </Typography>
        {bookings !== null
          ? bookings.length !== 0
            ? <Stack direction='row' display='flex' flexWrap='wrap'>
              {bookings.map((booking, i) => (
                <BookingLabel booking={booking} key={i}/>
              ))}
            </Stack>
            : <></>
          : <></>
        }
      </HeaderBox>
      <ReviewBar>
        <Stack direction="row" spacing={2} divider={ <FiberManualRecordSharpIcon sx={{ width: 5, height: 5 }}/>}
          sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GradeIcon sx={{ mr: 1 }}/>
            <Typography>{ratingCalc(reviews).reviewAvg} </Typography>
          </Box>
          <Typography> {ratingCalc(reviews).reviewCount} reviews </Typography>
          <Typography> {address} </Typography>
        </Stack>
      </ReviewBar>
      <Box sx={{ display: 'flex', maxWidth: '950px', flexWrap: 'wrap', alignItems: 'baseline' }}>
        <Box
        component='img'
        sx={{ width: 360, height: 250, marginRight: '1em', objectFit: 'fill' }}
        src={thumbnail.img}
        alt={'thumbnail of {title}'}
        />
        {pictures.length > 0
          ? <Button variant='contained' color='neutral' sx={{ maxHeight: '3em' }} onClick={showMoreImages}> Show More Images</Button>
          : <></>
        }
      </Box>
      <DetailsBox>
        <Typography variant='h6' sx={{ mt: 1 }}> {propertyType} </Typography>
        <Stack direction="row" spacing={2} divider={ <FiberManualRecordSharpIcon sx={{ width: 4, height: 4 }}/>} sx={{ maxWidth: '400px', alignItems: 'center', verticalAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BedIcon sx={{ mr: 1 }}/>
            <Typography> {bedrooms.length}
            {bedrooms.length > 1
              ? <Typography display='inline'> Bedrooms </Typography>
              : <Typography display='inline'> Bedroom </Typography>
            }</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HotelIcon sx={{ mr: 1 }}/>
            <Typography> {getNumberOfBeds(bedrooms)}
            {getNumberOfBeds(bedrooms) > 1
              ? <Typography display='inline'> Beds </Typography>
              : <Typography display='inline'> Bed </Typography>
          }</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BathtubIcon sx={{ mr: 1 }}/>
            <Typography> {bathrooms}
            {bathrooms > 1
              ? <Typography display='inline'> Bathrooms </Typography>
              : <Typography display='inline'> Bathroom </Typography>
            }</Typography>
          </Box>
        </Stack>
      </DetailsBox>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', maxWidth: '750px' }}>
        <AmenitiesBox>
          <Typography variant='h3' sx={{ fontWeight: 'bold' }}> What this place offers</Typography>
          <Box sx={{ maxWidth: 350, maxHeight: 250 }}>
            <Stack spacing={2} direction='row' display='flex' flexWrap='wrap' sx={{ mt: 2 }}>
              {amenities.map((x, i) => {
                return (<Chip label={x} key={i}/>)
              })}
              </Stack>
          </Box>
        </AmenitiesBox>
        <Box sx={{ maxWidth: 400, margin: '1em 0', textAlign: 'center' }}>
          <Card variant="outlined" sx={{
            border: '2px solid black',
            borderRadius: 4,
            padding: '1em 1em',
            textAlign: 'left',
          }}>
            <PricingBox>
              {search !== null
                ? getToken() === null
                  ? <div style={{ alignSelf: 'flex-end', alignItems: 'baseline' }}>
                      <Typography variant='h3' sx={{ mr: '0.5em', display: 'inline-block' }}> ${price * calcDays(new Date(start), new Date(end))} </Typography>
                      <Typography variant='h7' sx={{ display: 'inline-block' }}> TOTAL </Typography>
                    </div>
                  : <div style={{ alignSelf: 'flex-end', alignItems: 'baseline' }}>
                      <Typography variant='h3' sx={{ mr: '0.5em', display: 'inline-block' }}> ${price * calcDays(new Date(start), new Date(end))} </Typography>
                      <Typography variant='h7' sx={{ display: 'inline-block' }}> TOTAL </Typography>
                    </div>
                : <div style={{ alignSelf: 'flex-end', alignItems: 'baseline' }}>
                    <Typography variant='h3'sx={{ mr: '0.5em', display: 'inline-block' }}> ${price} </Typography>
                    <Typography sx={{ display: 'inline-block' }}> per night </Typography>
                  </div>
              }
            </PricingBox>
            <FormControl>
              <StyledSpan>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Check in"
                  value={start}
                  disabled={!loggedIn() || owner === jwtDecode(getToken())}
                  minDate={new Date()}
                  inputFormat="DD/MM/YYYY"
                  shouldDisableDate={disableBookedDays}
                  onChange={(newValue) => handleStartDate(newValue)}
                  disablePast
                  renderInput={(params) => <TextField id='startBooking' {...params} />}
                  />
                <DesktopDatePicker
                  label="Check Out"
                  value={end}
                  disabled={disabled || (!loggedIn() || owner === jwtDecode(getToken())) }
                  minDate={minDate}
                  inputFormat="DD/MM/YYYY"
                  shouldDisableDate={disableBookedDays}
                  onChange={(newValue) => handleEndDate(newValue)}
                  disablePast
                  renderInput={(params) => <TextField id='endBooking' {...params} />}
                />
              </LocalizationProvider>
              </StyledSpan>
            </FormControl>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
            {(!loggedIn() || owner === jwtDecode(getToken()) || (start === null || end === null))
              ? <Button variant='contained' color='primary' disabled> RESERVE </Button>
              : <Button variant='contained' color='primary' id='reserve-booking' onClick={submitBooking}> RESERVE </Button>
            }
            </div>
          </Card>
          {accepted !== 0
            ? <ReviewModal listing={listing} setListing={setListing} id={accepted} propertyid={listingId}/>
            : <Button variant='outlined' color='neutral' disabled sx={{ mt: 2 }}> Leave a Review </Button>
          }
        </Box>
      </Box>
      <Button variant='contained' color='neutral' onClick={handleBack}> RETURN </Button>
      </>)}
      </ThemeProvider>
      </Root>
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </>
  )
}
