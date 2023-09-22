import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Box, Card, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Root from './Root'
import { AddAvaliabilitiesCard } from './AddAvaliabilitiesCard';
import { getToken, jwtDecode, makeRequest } from '../helpers/helpers';
import { Alert } from '../components/Alert';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  vertical-align: top;
  margin-bottom: 1lr;
`;

const StyledCard = styled(Card)`
  width: 75vw;
  max-height: 50vh;
  padding: 2em;
  text-align: left;
`;

const InnerBox = styled(Box)`
  max-height: 30vh; 
  max-width: 50vw;
  overflow: scroll;
`

const Footer = styled.div`
  position: static;
  bottom: 0px;
`
export const PublishModal = ({ setOldHostings, availabilities, setAvailabilities, id }) => {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleClose = () => {
    setOpen(false);
    setAvailabilities([]);
  };

  const handleClick = () => setOpen(true);

  const handleOpenAlert = () => setOpenAlert(!openAlert);

  const handleErrMsg = msg => setErrMsg(msg);

  const handlePublish = async () => {
    const res = await makeRequest('listings/publish/' + id, 'PUT', {
      availability: availabilities
    });
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      setAvailabilities([]);
      setOpen(false);
      fetchListings();
    }
  }
  function addRange () {
    setAvailabilities([...availabilities, { start: '', end: '' }])
  }

  const fetchListings = async () => {
    const res = await makeRequest('listings/', 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      getHostings(res.listings)
        .then((data) => {
          setOldHostings(data);
        })
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
    setAvailabilities([...availabilities, { start: '', end: '' }]);
  }, [])

  return (
    <>
      <Button
        id='open-publish-modal'
        variant='contained'
        color='primary'
        onClick={handleClick}
        sx={ { mt: 2, mr: 2 } }
      >
        Publish
      </Button>
      <Modal open={open}>
        <Root>
          <StyledCard>
            <Header>
              <Typography variant="h5"> Availabilities
              <IconButton variant="contained" color="neutral" onClick={addRange}> <AddOutlinedIcon /> </IconButton></Typography>
              <IconButton onClick={handleClose}> <CloseIcon /> </IconButton>
            </Header>
            <InnerBox>
              {availabilities.map((item, i) => (
                <AddAvaliabilitiesCard availabilities={availabilities} setAvailabilities={setAvailabilities} idx={i} key={i}/>
              ))}
            </InnerBox>
            <Footer>
              {availabilities[0] === undefined || availabilities[0].end === ''
                ? (<Button
                  variant="contained"
                  disabled
                  color="primary"
                  sx={ { mr: 2, mt: 2 } }
                >
                  Publish
                </Button>)
                : <Button
                id='publish-btn'
                variant="contained"
                color="primary"
                onClick={handlePublish}
                sx={ { mr: 2, mt: 2 } }
                >
                  Publish
              </Button>
              }
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

PublishModal.propTypes = {
  setOldHostings: PropTypes.func,
  availabilities: PropTypes.array,
  setAvailabilities: PropTypes.func,
  id: PropTypes.number
}
