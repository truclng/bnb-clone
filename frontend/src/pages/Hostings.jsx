import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HostingCard } from '../components/HostingCard';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import { ThemeProvider, Typography } from '@mui/material';
import { theme } from '../styles/styles';
import { getToken, jwtDecode, makeRequest } from '../helpers/helpers';
import { NavBar } from '../components/homeNavBar';
import { Alert } from '../components/Alert';

const Root = styled.div`
  margin-left: 1em; 
  margin-right: 1em;
  margin-top: 1em;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2em;
`;

export const Hostings = () => {
  const [isHomePage, setHomePage] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const navigate = useNavigate();

  const [hostings, setHostings] = useState([]);
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
    fetchListings();
  }, []);

  const newHosting = () => {
    navigate('/hostings/create');
  }

  return (
    <>
    <NavBar isHome={isHomePage} setHome={setHomePage} />
    <Root>
      <ThemeProvider theme={theme}>
      <div>
        <Header>
          <Typography variant='h4'> My Hostings </Typography>
          <Button id='new-hosting' variant='outlined' color='neutral' sx={ { mt: 2 } } onClick={newHosting}> <AddOutlinedIcon /> New Hosting </Button>
        </Header>
        {hostings.length !== 0
          ? hostings.map((listing, idx) => {
            return (listing[0].owner === jwtDecode(getToken()))
              ? <HostingCard listing={listing} hostings={hostings} setHostings={setHostings} key={idx}/>
              : <></>
          })
          : <Typography> No hostings to show! </Typography>
        }
        <br></br>
      </div>
        {openAlert &&
          <Alert msg={errMsg} toggleModal={handleOpenAlert} />
        }
      </ThemeProvider>
    </Root>
    </>
  )
}
