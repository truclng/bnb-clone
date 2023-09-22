import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import { Box, TextField, ThemeProvider, Typography } from '@mui/material';
import { fileToDataUrl, getToken, makeRequest } from '../helpers/helpers';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/styles';
import { AddBedroomsModal } from '../components/AddBedroomsModal';
import { Alert } from '../components/Alert';
import { BedroomCard } from '../components/BedroomCard';
import { NavBar } from '../components/homeNavBar';
import { formLeft } from '../styles/createListingStyles';
import { AmenitiesBox } from '../components/AmenitiesBox';

const PreviewBox = styled(Box)`
  width: 100%;
  flex-direction: row; 
  align-items: bottom;
`;

export const CreateNewHosting = () => {
  const [isHomePage, setHomePage] = React.useState(false);
  const navigate = useNavigate();

  const [title, setTitle] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [price, setPrice] = useState(undefined);
  const [thumbnail, setThumbnail] = useState(undefined);
  const [propertyType, setPropertyType] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [bathrooms, setBathrooms] = useState(undefined);
  const [bedrooms, setBedrooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = msg => {
    setErrMsg(msg);
  }

  const createListing = async () => {
    const res = await makeRequest('listings/new', 'POST', {
      title,
      address,
      price,
      thumbnail,
      metadata: {
        propertyType,
        bathrooms,
        bedrooms,
        amenities,
        pictures: []
      }
    }, getToken());
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      navigate('/hostings');
    }
  }

  const handleBackToHostings = () => {
    navigate('/hostings');
  }

  useEffect(() => {
    if (thumbnail) {
      setImageUrl(thumbnail.img);
    }
  }, [thumbnail]);

  return (
    <>
    <NavBar isHome={isHomePage} setHome={setHomePage} />
    <div style = {{ textAlign: 'left' }}>
      <ThemeProvider theme={theme}>
        <Typography variant='h4' fontSize='auto' sx={ { m: 4 } }>Create New Hosting</Typography>
        <div style={formLeft}>
          <form onSubmit={(e) => {
            e.preventDefault();
            createListing();
          }}>
            <table style={{ minWidth: '400', maxHeight: '100vh' }}>
              <tbody>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Title</Typography>
                  <td>
                    <TextField id='title' variant='outlined' size='small'
                    onChange={(event) => setTitle(event.currentTarget.value)}
                    value={title} sx={{ width: '100%' }} required/>
                    </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Address</Typography>
                  <td>
                    <TextField id='address' variant='outlined' size='small'
                    onChange={(event) => setAddress(event.currentTarget.value)}
                    value={address} sx={{ width: '100%' }} required/>
                  </td>
                </tr>
                <tr>
                <Typography sx={ { mr: 1, mt: 1 } }>Price Per Night</Typography>
                  <td>
                    <TextField id='price' variant='outlined' size='small'
                    type='number' onChange={(event) => event.target.value < 0
                      ? setPrice(0)
                      : setPrice(event.currentTarget.value)}
                    value={price} sx={{ width: '100%' }} required/>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Thumbnail</Typography>
                  <td><input id='upload' accept="image/*" type="file" style={{ display: 'none' }}
                  onChange={(event) => fileToDataUrl(event.currentTarget.files[0]).then((data) => setThumbnail({ img: data, label: { title } }))} required/>
                  <PreviewBox>
                    {(imageUrl && thumbnail)
                      ? <Box component='img'
                        sx={{
                          width: '100%',
                          height: '100%'
                        }}
                        src={imageUrl} alt={thumbnail.name}/>
                      : <Box mt={1}> <Typography> No thumbnail uploaded! </Typography></Box>
                    }
                    <label htmlFor='upload' id='upload-file'>
                      <Button id='thumbnail' variant='contained' color='neutral' sx={ { mt: 1 } } component="span">Upload</Button>
                    </label>
                  </PreviewBox>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Property Type</Typography>
                  <td>
                    <TextField id='outlined-basic' variant='outlined' size='small'
                    onChange={(event) => setPropertyType(event.currentTarget.value)}
                    value={propertyType} sx={{ width: '100%' }} required/>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Number of Bathrooms</Typography>
                  <td>
                    <TextField id='outlined-basic' variant='outlined' size='small'
                    type='number' onChange={(event) => event.target.value < 0
                      ? setBathrooms(0)
                      : setBathrooms(event.currentTarget.value)}
                    value={bathrooms} sx={{ width: '100%' }} min='1' required/>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Bedrooms</Typography>
                  <td>
                    {bedrooms.map((item, i) => (
                      <BedroomCard bedroom={item} number={i} bedrooms={bedrooms} setBedrooms={setBedrooms} key={i}/>
                    ))}
                    <AddBedroomsModal bedrooms={bedrooms} setBedrooms={setBedrooms} required/>
                  </td>
                </tr>
                <tr>
                <Typography sx={ { mr: 1, mt: 1 } }>Amenities</Typography>
                <td>
                  <AmenitiesBox amenities={amenities} setAmenities={setAmenities}/>
                </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <div style={formLeft}>
          <Button type='submit' id='create' variant='contained' color='primary' sx={ { mr: 2, mt: 2 } } onClick={createListing}>CREATE</Button>
          <Button variant='contained' color='neutral' sx={ { mt: 2 } } onClick={handleBackToHostings}>RETURN</Button>
        </div>
        {openAlert &&
          <Alert msg={errMsg} toggleModal={handleOpenAlert} />
        }
      </ThemeProvider>
    </div>
    </>
  );
}
