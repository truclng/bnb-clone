import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Button, Card, CardActionArea, CardMedia, Rating, Typography } from '@mui/material';
import { getToken, jwtDecode, makeRequest } from '../helpers/helpers';
import { PublishModal } from './PublishModal'
import { useNavigate } from 'react-router-dom';
import { Alert } from './Alert';
import { ratingCalc } from '../helpers/listingHelpers';

const Actions = styled(Box)`
  text-align: right;
`;

const InfoBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const PropertyDetails = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const MoreInfoBox = styled(Box)`
  display: flex; 
  justify-content: space-between;
  align-items: left;
`;

const DetailBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-right: 1em;
`;

export const HostingCard = ({ listing, hostings, setHostings }) => {
  const [openAlert, setOpenAlert] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const navigate = useNavigate();
  const [avrRating, setavrRating] = useState(0);
  const [numBeds, setNumBeds] = useState(0);
  const [availabilities, setAvailabilities] = useState([]);
  const count = ratingCalc(listing[0].reviews).reviewCount;

  const handleRemove = async () => {
    const res = await makeRequest('listings/' + listing[1], 'DELETE', {});
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      const copyOf = [...hostings];
      const index = copyOf.indexOf(listing);
      copyOf.splice(index, 1);
      setHostings(copyOf);
    }
  }

  const handleUnpublish = async () => {
    const res = await makeRequest('listings/unpublish/' + listing[1], 'PUT');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      fetchListings();
    }
  }

  const handleEdit = () => navigate('/hostings/' + listing[1]);

  const getAvrRating = (listing) => {
    setavrRating(ratingCalc(listing[0].reviews).reviewAvg);
  }

  const getNumberOfBeds = (listing) => {
    const bedroomArray = listing[0].metadata.bedrooms;
    let count = 0;
    bedroomArray.forEach(function (x) {
      if (x.length !== 0) {
        x.forEach(function (y) {
          count = count + y.number;
        })
      }
    });
    return setNumBeds(count);
  }

  const fetchListings = async () => {
    const res = await makeRequest('listings/', 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      getHostings(res.listings)
        .then((data) => {
          setHostings(data);
        });
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

  const getHostings = async (allListings) => {
    const hostings = [];
    for (const listing of allListings) {
      const details = await getListingDetails(listing.id);
      if (details.owner === jwtDecode(getToken())) {
        const detailsObj = [details];
        detailsObj.push(listing.id);
        hostings.push(detailsObj);
      }
    }
    return hostings;
  }

  useEffect(() => {
    getAvrRating(listing);
    getNumberOfBeds(listing);
  }, [])

  const viewBookings = () => {
    navigate('/bookings/' + listing[1]);
  }

  console.log(listing)
  return (
    <Box sx={{ maxWidth: 900, minWidth: 350, mt: 2 }}>
      <Card variant="outlined" sx={{
        border: '2px solid black',
        borderRadius: 4,
        padding: '10px 10px',
        textAlign: 'left',
      }}>
      <InfoBox>
          <Card style={{ border: 'none', boxShadow: 'none' }} sx={{ minWidth: 100, maxWidth: 250 }}>
            <CardActionArea>
              <CardMedia
                  component='img'
                  id='edit-hosting'
                  image={listing[0].thumbnail.img}
                  alt={listing[0].title}
                  onClick={handleEdit}
                  />
            </CardActionArea>
          </Card>
          <PropertyDetails>
            <Typography> <b>{listing[0].title}</b></Typography>
            <Typography color='neutral' sx={{ mt: 2 }}> {listing[0].metadata.propertyType}</Typography>
            <Rating name='read-only' value={Number(avrRating)} readOnly sx={{ mt: 2 }} precision={0.5} />
          </PropertyDetails>
          <MoreInfoBox>
            <DetailBox>
              <Typography color='neutral' sx={{ mt: 2 }}>Beds</Typography>
              <Typography color='neutral' sx={{ mt: 2 }}><b>{numBeds}</b></Typography>
            </DetailBox>
            <DetailBox>
              <Typography color='neutral' sx={{ mt: 2 }}>Bathrooms</Typography>
              <Typography color='neutral' sx={{ mt: 2 }}><b>{listing[0].metadata.bathrooms}</b></Typography>
            </DetailBox>
            <DetailBox>
              <Typography color='neutral' sx={{ mt: 2 }}>Total Reviews</Typography>
              <Typography color='neutral' sx={{ mt: 2 }}><b>{count}</b></Typography>
            </DetailBox>
            <DetailBox>
              <Typography color='neutral' sx={{ mt: 2 }}>Price Per Night</Typography>
              <Typography color='neutral' sx={{ mt: 2 }}><b>${listing[0].price}</b></Typography>
            </DetailBox>
          </MoreInfoBox>
        </InfoBox>
        <Actions>
          {listing[0].published === true
            ? <>
              <Button
                variant="contained"
                color="primary"
                onClick={viewBookings}
                sx={ { mr: 2, mt: 2 } }
                >
                Bookings
              </Button>
              <Button
                id="unpublish-btn"
                variant="contained"
                color="primary"
                onClick={handleUnpublish}
                sx={ { mr: 2, mt: 2 } }
                >
                Unpublish
              </Button>
              </>
            : <PublishModal oldHostings={hostings} setOldHostings={setHostings} availabilities={availabilities} setAvailabilities={setAvailabilities} id={listing[1]}/>
          }
          <Button
            variant="contained"
            color="neutral"
            onClick={handleRemove}
            sx={ { mr: 2, mt: 2 } }
            >
              Remove
          </Button>
        </Actions>
      </Card>
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </Box>
  )
}

HostingCard.propTypes = {
  listing: PropTypes.array,
  hostings: PropTypes.array,
  setHostings: PropTypes.func,
  allBookings: PropTypes.arrayOf(PropTypes.object),
}
