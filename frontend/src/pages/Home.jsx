import React from 'react';
import Grid from '@mui/material/Grid';
import { NavBar } from '../components/homeNavBar';
import { jwtDecode, loggedIn, makeRequest } from '../helpers/helpers';
import { Alert } from '../components/Alert';
import { ListingCard } from '../components/ListingCard';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/system';
import { ratingCalc } from '../helpers/listingHelpers';
import { Typography } from '@mui/material';

const sortRatingHigh = (el1, el2) => {
  return el2 - el1;
}

const sortRatingLow = (el1, el2) => {
  return el1 - el2;
}

export const Context = React.createContext([]);

export const Home = () => {
  const [isHomePage, setHomePage] = React.useState(true);
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [display, setDisplay] = React.useState([]);
  const [booked, setBooked] = React.useState([]);
  const [published, setPublished] = React.useState([]);
  const [results, setResults] = React.useState([]);
  const [isSearch, setSearch] = React.useState(false);

  const [openAlert, setOpenAlert] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const getBookings = async (user) => {
    if (loggedIn()) {
      const res = await makeRequest('bookings', 'GET');
      if (res.error) {
        handleErrMsg(res.error);
        handleOpenAlert();
      } else {
        const allBookings = res.bookings;
        const booked = [];
        allBookings.forEach((booking) => {
          if (booking.owner === user && !booked.includes(booking.listingId)) {
            booked.push(booking.listingId);
          }
        });
        return booked;
      }
    }
  }

  const getListingDetails = async (id) => {
    const res = await makeRequest(`listings/${id}`, 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      return res.listing;
    }
  }

  const getPublishedListings = async (allListings) => {
    let bookings = [];
    const tempBooks = [];
    const normalDisplay = [];
    const publishedListings = [];
    if (token !== null) {
      bookings = await getBookings(jwtDecode(token));
    }
    for (const listing of allListings) {
      const details = await getListingDetails(listing.id);
      const lId = listing.id;
      details.id = lId;
      details.isBooked = false;
      if (details.published) {
        const review = ratingCalc(details.reviews);
        details.avgReview = review.reviewAvg;
        details.countReview = review.reviewCount;
        if (bookings !== undefined) {
          if (bookings.includes(details.id.toString())) {
            details.isBooked = true;
            tempBooks.push(details);
          } else {
            normalDisplay.push(details);
          }
        }
        publishedListings.push(details);
      }
    }
    return [tempBooks, normalDisplay, publishedListings];
  }

  const getListings = async () => {
    const res = await makeRequest('listings', 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      getPublishedListings(res.listings)
        .then((data) => {
          const bListings = data[0];
          const nListings = data[1];
          const pListings = data[2];
          bListings.sort((a, b) => a.title.localeCompare(b.title));
          bListings.sort((l1, l2) => sortRatingHigh(l1.avgReview, l2.avgReview));
          nListings.sort((a, b) => a.title.localeCompare(b.title));
          nListings.sort((l1, l2) => sortRatingHigh(l1.avgReview, l2.avgReview));
          pListings.sort((a, b) => a.title.localeCompare(b.title));
          pListings.sort((l1, l2) => sortRatingHigh(l1.avgReview, l2.avgReview));
          setBooked(bListings);
          setDisplay(nListings);
          setPublished(pListings);
        });
    }
  }

  const [ratingOrder, setRatingOrder] = React.useState('high to low');
  const handleRatingOrder = (event, newOrder) => {
    setRatingOrder(newOrder);
  }

  React.useEffect(() => {
    const lsToken = localStorage.getItem('token');
    if (lsToken) {
      setToken(lsToken);
      setLoading(false);
    }
    getListings();
  }, [loading]);

  const sortHighToLow = () => {
    booked.sort((l1, l2) => sortRatingHigh(l1.avgReview, l2.avgReview));
    display.sort((l1, l2) => sortRatingHigh(l1.avgReview, l2.avgReview));
  }

  const sortLowToHigh = () => {
    booked.sort((l1, l2) => sortRatingLow(l1.avgReview, l2.avgReview));
    display.sort((l1, l2) => sortRatingLow(l1.avgReview, l2.avgReview));
  }

  return (
    <div>
      <Context.Provider value={ { published, display, setDisplay, booked, setBooked, setResults, setSearch } }>
        <NavBar isHome={isHomePage} setHome={setHomePage} setLoading={setLoading} setToken={setToken} />
      </Context.Provider>
      <Box sx={ { textAlign: 'right' } }>
        <ToggleButtonGroup
          value={ratingOrder}
          exclusive
          onChange={handleRatingOrder}
          aria-label='listing rating order view sort'
          size='small'
          sx={ { mt: 2, mr: 2 } }
        >
          <ToggleButton value='high to low' aria-label='high to low' onClick={sortHighToLow}>
            High to Low
          </ToggleButton>
          <ToggleButton value='low to high' aria-label='low to high' onClick={sortLowToHigh}>
            Low to High
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Grid container spacing={ { xs: 2, sm: 1 } }>
        {isSearch && (
          results.map((listing, idx) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <ListingCard key={listing.id} imgUrl={listing.thumbnail.img} altText={listing.thumbnail.label.title} title={listing.title}
                  avgRating={listing.avgReview} reviewCount={listing.countReview} otherDetails={listing} isBooked={listing.isBooked} />
              </Grid>
            );
          })
        )}
        {!isSearch && booked.map((listing, idx) => {
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <ListingCard key={listing.id} imgUrl={listing.thumbnail.img} altText={listing.thumbnail.label.title} title={listing.title}
                avgRating={listing.avgReview} reviewCount={listing.countReview} otherDetails={listing} isBooked={listing.isBooked} />
            </Grid>
          );
        })}
        {!isSearch && display.map((listing, idx) => {
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <ListingCard key={listing.id} imgUrl={listing.thumbnail.img} altText={listing.thumbnail.label.title} title={listing.title}
                avgRating={listing.avgReview} reviewCount={listing.countReview} otherDetails={listing} isBooked={listing.isBooked} />
            </Grid>
          );
        })}
      </Grid>
      {(isSearch && results.length === 0) && (
        <Typography sx={ { ml: 2 } }>No search results... Try something else!</Typography>
      )}
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </div>
  );
}
