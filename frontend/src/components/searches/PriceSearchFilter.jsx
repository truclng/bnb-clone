import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, ThemeProvider } from '@mui/material';
import { theme } from '../../styles/styles';
import { styled } from '@mui/system';
import { Context } from '../../pages/Home';
import { CloseContext } from '../homeNavBar';

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '30vw',
  [theme.breakpoints.up('xs')]: {
    marginTop: 10,
    marginRight: 10
  },
  [theme.breakpoints.up('sm')]: {
    width: '27vw',
  },
  [theme.breakpoints.up('md')]: {
    width: '12vw',
  },
}));

export const PricesFilter = () => {
  const closeSearch = React.useContext(CloseContext);
  const [priceFrom, setPriceFrom] = React.useState('');
  const [priceTo, setPriceTo] = React.useState('');

  const handleChangeFrom = (event) => {
    setPriceFrom(event.target.value);
  }
  const handleChangeTo = (event) => {
    setPriceTo(event.target.value);
  }

  const priceFilterMatch = (listing) => {
    const listingPrice = parseFloat(listing.price);
    let lowerPrice = parseFloat(priceFrom);
    let upperPrice = parseFloat(priceTo);
    if (upperPrice < lowerPrice) {
      lowerPrice = parseFloat(priceTo);
      upperPrice = parseFloat(priceFrom);
    }
    if (listingPrice <= upperPrice && listingPrice >= lowerPrice) {
      return true;
    } else {
      return false;
    }
  }

  const { published, setSearch, setResults } = React.useContext(Context);
  const matches = [];
  const searchByPrice = () => {
    setSearch(true);
    published.forEach((listing) => {
      if (priceFilterMatch(listing)) {
        matches.push(listing);
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
       <Box sx={ { display: 'flex', flexWrap: 'wrap', alignItems: 'center' } }>
        <StyledTextField
          label='From (per night)'
          value={priceFrom}
          onChange={handleChangeFrom}
          id='price-from-input'
          InputProps={ {
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          } }
        />
        <StyledTextField
          label='To (per night)'
          value={priceTo}
          onChange={handleChangeTo}
          id='price-to-input'
          InputProps={ {
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          } }
        />
        <Button
          color='primary'
          variant='contained'
          sx={ { ml: 2 } }
          id='search-price-enable-btn'
          onClick={() => {
            searchByPrice();
            setResults(matches);
            closeSearch();
          }}
        >
          <SearchIcon />
        </Button>
      </Box>
    </ThemeProvider>
  );
}
