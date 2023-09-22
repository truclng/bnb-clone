import React from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, ThemeProvider } from '@mui/material';
import { theme } from '../../styles/styles';
import { Context } from '../../pages/Home';
import { CloseContext } from '../homeNavBar';

export const LocationSearchFilter = () => {
  const closeSearch = React.useContext(CloseContext);
  const [city, setCity] = React.useState('');
  const handleChange = (event) => {
    setCity(event.target.value);
  }

  const { published, setSearch, setResults } = React.useContext(Context);
  const matches = [];
  const searchByLocation = () => {
    setSearch(true);
    published.forEach((listing) => {
      const lAddress = listing.address.toLowerCase();
      if (lAddress.includes(city.toLowerCase())) {
        matches.push(listing);
      }
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <TextField
        label='Enter City'
        value={city}
        onChange={handleChange}
        variant='standard'
      />
      <Button
        color='primary'
        variant='contained'
        sx={ { ml: 2 } }
        onClick={() => {
          searchByLocation();
          setResults(matches);
          closeSearch();
        }}
      >
        <SearchIcon />
      </Button>
    </ThemeProvider>
  );
}
