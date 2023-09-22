import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import { Box, TextField, ThemeProvider, Typography } from '@mui/material';
import { fileToDataUrl, makeRequest } from '../helpers/helpers';
import { useNavigate, useParams } from 'react-router-dom';
import { theme } from '../styles/styles';
import { Alert } from '../components/Alert';
import { NavBar } from '../components/homeNavBar';
import { formLeft } from '../styles/createListingStyles';
import { EditBedroomsModal } from '../components/EditBedroomsModal';
import { AddBedroomsModal } from '../components/AddBedroomsModal';
import { EditAmenitiesBox } from '../components/EditAmenitiesBox';
import { ImageCarousel } from '../components/ImageCarousel';

const PreviewBox = styled(Box)`
  width: 100%;
  flex-direction: row; 
  align-items: bottom;
`;

const BedroomBox = styled(Box)`
  width: 100%;
  max-height: 10vh;
  flex-direction: row;
  overflow: scroll;
`

export const EditHosting = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [isHomePage, setHomePage] = useState(false);

  const [title, setTitle] = useState(undefined);
  const [oldTitle, setOldTitle] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [price, setPrice] = useState(undefined);
  const [thumbnail, setThumbnail] = useState(undefined);
  const [propertyType, setPropertyType] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [bathrooms, setBathrooms] = useState(undefined);
  const [bedrooms, setBedrooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [pictures, setPictures] = useState(undefined);
  const [openAlert, setOpenAlert] = useState(false);
  const [gallery, setGallery] = useState([])
  const [errMsg, setErrMsg] = useState('');

  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }

  const handleErrMsg = msg => {
    setErrMsg(msg);
  }

  const editListing = async () => {
    const res = await makeRequest('listings/' + id, 'PUT', {
      title,
      address,
      price,
      thumbnail,
      metadata: {
        propertyType,
        bathrooms,
        bedrooms,
        amenities,
        pictures
      }
    });
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      navigate('/hostings');
    }
  }

  const getListingDetails = async (id) => {
    const res = await makeRequest(`listings/${id}`, 'GET');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      setOldTitle(res.listing.title)
      setTitle(res.listing.title)
      setAddress(res.listing.address)
      setPrice(res.listing.price)
      setThumbnail(res.listing.thumbnail)
      setPropertyType(res.listing.metadata.propertyType)
      setBathrooms(res.listing.metadata.bathrooms)
      setBedrooms(res.listing.metadata.bedrooms)
      setAmenities(res.listing.metadata.amenities)
      setPictures(res.listing.metadata.pictures)
    }
  }

  const handlePictures = async (files) => {
    const filesArray = Array.from(files);
    const res = await convertToList(filesArray);
    return res;
  }

  const convertToList = async (files) => {
    const pictureList = [];
    files.forEach((x) => {
      fileToDataUrl(x).then((data) => {
        pictureList.push({ img: data, label: x.name.split('.')[0] });
      })
    })
    return pictureList;
  }

  const handleBackToHostings = () => {
    navigate('/hostings');
  }

  useEffect(() => {
    if (thumbnail) {
      setImageUrl(thumbnail.img);
    }
  }, [thumbnail]);

  useEffect(() => {
    if (pictures) {
      setGallery(pictures)
    }
  }, [pictures])

  useEffect(() => {
    getListingDetails(id);
  }, []);

  return (
    <>
    <NavBar isHome={isHomePage} setHome={setHomePage} />
    <div style = {{ textAlign: 'left' }}>
      <ThemeProvider theme={theme}>
        <Typography variant='h4' sx={ { m: 2 } }>Edit {oldTitle}</Typography>
        <div style={formLeft}>
          <form onSubmit={(e) => {
            e.preventDefault();
            editListing();
          }}>
            <table style={{ minWidth: '400', maxHeight: '100vh' }}>
              <tbody>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Title</Typography>
                  <td>
                    <TextField id="title" variant="outlined" size='small'
                    onChange={(event) => setTitle(event.currentTarget.value)}
                    value={title} sx={{ width: '100%' }} required/>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Address</Typography>
                  <td>
                    <TextField id="address" variant="outlined" size='small'
                    onChange={(event) => setAddress(event.currentTarget.value)}
                    value={address} sx={{ width: '100%' }} required/>
                  </td>
                </tr>
                <tr>
                <Typography sx={ { mr: 1, mt: 2 } }>Price Per Night</Typography>
                  <td>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                    type="number" onChange={(event) => event.target.value < 0
                      ? setPrice(0)
                      : setPrice(event.currentTarget.value)}
                    value={price} sx={{ width: '100%' }} min='0' required/>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Thumbnail</Typography>
                  <td><input id="thumbnail" accept="image/*" type="file" style={{ display: 'none' }}
                  onChange={(event) => fileToDataUrl(event.currentTarget.files[0]).then((data) => setThumbnail({ img: data, label: { title } }))} required/>
                  <PreviewBox>
                    {(imageUrl && thumbnail)
                      ? <Box component='img'
                        sx={{
                          width: '100%',
                          height: '100%'
                        }}
                        src={imageUrl} alt={thumbnail.name}/>
                      : <></>
                    }
                    <label htmlFor='thumbnail' id='update-thumbnail'>
                      <Button variant='contained' color='neutral' sx={ { mt: 1 } } component="span">Update</Button>
                    </label>
                  </PreviewBox>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Property Type</Typography>
                  <td>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                    onChange={(event) => setPropertyType(event.currentTarget.value)}
                    value={propertyType} sx={{ width: '100%' }} required/>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Number of Bathrooms</Typography>
                  <td>
                    <TextField id="outlined-basic" variant="outlined" size='small'
                    type="number" onChange={(event) => event.target.value < 0
                      ? setBathrooms(0)
                      : setBathrooms(event.currentTarget.value)}
                    value={bathrooms} sx={{ width: '100%' }} min='0' required/>
                  </td>
                </tr>
                <tr>
                  <Typography sx={ { mr: 1, mt: 1 } }>Bedrooms</Typography>
                  <td>
                    <BedroomBox>
                      {bedrooms.map((item, i) => (
                        <EditBedroomsModal bedroom={item} number={i} bedrooms={bedrooms} setBedrooms={setBedrooms} key={i}/>
                      ))}
                    </BedroomBox>
                    <AddBedroomsModal bedrooms={bedrooms} setBedrooms={setBedrooms} />
                  </td>
                </tr>
                <tr>
                <Typography sx={ { mr: 1, mt: 1 } }>Amenities</Typography>
                  <td>
                    <EditAmenitiesBox amenities={amenities} setAmenities={setAmenities}/>
                  </td>
                </tr>
                <tr>
                <Typography sx={ { mr: 1, mt: 1 } }>Pictures</Typography>
                  <td><input id="list" accept="image/*" type="file" style={{ display: 'none' }}
                  onChange={(event) => handlePictures(event.target.files).then((data) => setPictures(data))} multiple required/>
                  <PreviewBox>
                    {gallery.length > 0
                      ? <ImageCarousel pictures={gallery} />
                      : <></>
                    }
                    <label htmlFor='list'>
                      <Button variant='contained' color='neutral' sx={ { mt: 1 } } component="span">Upload</Button>
                    </label>
                  </PreviewBox>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <div style={formLeft}>
          <Button id='save' variant='contained' color='primary' sx={ { mr: 2, mt: 2 } } onClick={editListing}>Save</Button>
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
