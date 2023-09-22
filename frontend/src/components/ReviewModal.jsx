import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Button, Card, IconButton, Modal, Rating, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Root from './Root'
import { makeRequest } from '../helpers/helpers';
import { Alert } from '../components/Alert';

const CHARACTER_LIMIT = 256;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 1lr;
`;

const StyledCard = styled(Card)`
    width: 50vw;
    max-height: 50vh;
    padding: 2em;
    text-align: left;
`;

const InnerBox = styled(Box)`
  max-height: 30vh; 
  overflow: scroll;
`

const Footer = styled.div`
  position: static;
  bottom: 0px;
`
export const ReviewModal = ({ listing, setListing, id, propertyid }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(null)
  const [rating, setRating] = useState(null)
  const [openAlert, setOpenAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [disabled, setDisabled] = useState(true);

  const handleClose = () => {
    setOpen(false);
    setText(null);
    setRating(null);
    setDisabled(true)
  };

  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }

  const handleErrMsg = msg => {
    setErrMsg(msg);
  }

  const handleClick = () => setOpen(true);

  const handleSubmit = async () => {
    console.log(rating, text)
    const res = await makeRequest(`listings/${propertyid}/review/${id}`, 'PUT', {
      review: {
        rating,
        text
      }
    })
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      alert('Review written!')
      setText(null);
      setRating(null);
      setOpen(false);
      getListingDetails(propertyid)
      setDisabled(true)
    }
  }

  const getListingDetails = async (id) => {
    const res = await makeRequest(`listings/${id}`, 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      setListing(res.listing)
    }
  }

  const handleReviewChange = (e) => {
    setText(e.target.value);
  }

  useEffect(() => {
    if (rating !== null) {
      setDisabled(false)
    }
  }, [text, rating])

  return (
    <>
      <Button
          data-testid = 'btn'
          variant="outlined"
          color="neutral"
          onClick={handleClick}
          sx={ { mt: 2 } }
      >
          Leave a Review
      </Button>
      <Modal open={open}>
        <Root>
          <StyledCard>
            <Header>
                <Typography variant="h5"> Review for {listing.title} </Typography>
              <IconButton onClick={handleClose}> <CloseIcon /> </IconButton>
            </Header>
            <InnerBox>
                <Rating
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    precision={0.5}
                />
                <TextField
                    rows={6}
                    multiline
                    placeholder="How was your experience?"
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                    }}
                    value={text}
                    onChange={handleReviewChange}
                    sx={{ width: '100%' }}
                    helperText={
                        text !== null
                          ? text.length >= CHARACTER_LIMIT && 'Character limit reached'
                          : <></>
                    }
                />
            </InnerBox>
            <Footer>
              <Button
                disabled={disabled}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={ { mr: 2, mt: 2 } }
              >
                Submit Review
              </Button>
              <Button
                variant="contained"
                color="neutral"
                onClick={handleClose}
                sx={ { mr: 2, mt: 2 } }
              >
                  Close
              </Button>
            </Footer>
          </StyledCard>
        </Root>
      </Modal>
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </>
  );
};

ReviewModal.propTypes = {
  listing: PropTypes.object,
  setListing: PropTypes.func,
  id: PropTypes.number,
  propertyid: PropTypes.string
}
