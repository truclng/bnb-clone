import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';
import { CardActionArea, ThemeProvider } from '@mui/material';
import { theme } from '../styles/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ListingCard = (props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const dates = searchParams.get('q');

  const styleDiv = {
    display: 'flex',
    justifyContent: 'space-between'
  }

  const styleRating = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }

  const viewListing = () => {
    if (dates === null) {
      navigate('/listing/' + props.otherDetails.id);
    } else {
      navigate('/listing/' + props.otherDetails.id + `/?q=${dates.split(' ')[0]}+${dates.split(' ')[1]}`);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 280, height: 295, m: 5 }} onClick={viewListing}>
        <CardActionArea>
          <CardMedia
            component='img'
            height='180'
            image={props.imgUrl}
            alt='property thumbnail image display'
          />
          <CardContent>
            <div style={styleDiv}>
              <Typography variant='h5' sx={ { mr: 4 } }>
                {props.title}
              </Typography>
              <div style={styleRating}>
                <Typography variant='body2'>
                  {props.avgRating}
                </Typography>
                <StarIcon sx={ { color: 'neutral' } }/>
              </div>
            </div>
            <div style={ { textAlign: 'right' } }>
              {(props.reviewCount === 0 || props.reviewCount > 1) &&
                <Typography textAlign='right' variant='body2'>
                  {props.reviewCount} reviews
                </Typography>
              }
              {props.reviewCount === 1 &&
                <Typography textAlign='right' variant='body2'>
                  {props.reviewCount} review
                </Typography>
              }
            </div>
            {props.isBooked && (
              <Typography variant='body2'>
                BOOKED
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </ThemeProvider>
  );
}

ListingCard.propTypes = {
  imgUrl: PropTypes.obj,
  title: PropTypes.string,
  avgRating: PropTypes.number,
  reviewCount: PropTypes.number,
  otherDetails: PropTypes.object,
  isBooked: PropTypes.bool,
  altText: PropTypes.string,
}
