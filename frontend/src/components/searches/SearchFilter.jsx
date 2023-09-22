import React from 'react';
import Button from '@mui/material/Button';
import { Box, ToggleButtonGroup, ToggleButton, ThemeProvider } from '@mui/material';
import { theme } from '../../styles/styles';
import { TitleSearchFilter } from './TitleSearchFilter';
import { LocationSearchFilter } from './LocationSearchFilter';
import { BedroomFilter } from './BedroomSearchFilter';
import { DatesFilter } from './DateSearchFilter';
import { PricesFilter } from './PriceSearchFilter';
import { CloseContext } from '../homeNavBar';

export const SearchFilter = () => {
  const [filter, setFilter] = React.useState('title');
  const handleChange = (event, newFilter) => {
    setFilter(newFilter);
  }

  const [title, setTitle] = React.useState(true);
  const openTitleFilter = () => {
    setTitle(true);
    closeLocationFilter();
    closeBedroomFilter();
    closeDateFilter();
    closePriceFilter();
  }
  const closeTitleFilter = () => {
    setTitle(false);
  }

  const [location, setLocation] = React.useState(false);
  const openLocationFilter = () => {
    setLocation(true);
    closeTitleFilter();
    closeBedroomFilter();
    closeDateFilter();
    closePriceFilter();
  }
  const closeLocationFilter = () => {
    setLocation(false);
  }

  const [bedroom, setBedroom] = React.useState(false);
  const openBedroomFilter = () => {
    setBedroom(true);
    closeTitleFilter();
    closeLocationFilter();
    closeDateFilter();
    closePriceFilter();
  }
  const closeBedroomFilter = () => {
    setBedroom(false);
  }

  const [date, setDate] = React.useState(false);
  const openDateFilter = () => {
    setDate(true);
    closeTitleFilter();
    closeLocationFilter();
    closeBedroomFilter();
    closePriceFilter();
  }
  const closeDateFilter = () => {
    setDate(false);
  }

  const [price, setPrice] = React.useState(false);
  const openPriceFilter = () => {
    setPrice(true);
    closeTitleFilter();
    closeLocationFilter();
    closeBedroomFilter();
    closeDateFilter();
  }
  const closePriceFilter = () => {
    setPrice(false);
  }

  const closeSearch = React.useContext(CloseContext);

  return (
    <ThemeProvider theme={theme}>
      <ToggleButtonGroup
        color='primary'
        value={filter}
        exclusive
        onChange={handleChange}
        aria-label='Search Filter Navigation'
      >
        <ToggleButton value='title' id='title-search-filter' onClick={openTitleFilter}>Title</ToggleButton>
        <ToggleButton value='city' id='city-search-filter' onClick={openLocationFilter}>City Location</ToggleButton>
        <ToggleButton value='bedrooms' id='bedroom-search-filter' onClick={openBedroomFilter}>Number of Bedrooms</ToggleButton>
        <ToggleButton value='dates' id='date-search-filter' onClick={openDateFilter}>Dates</ToggleButton>
        <ToggleButton value='prices' id='price-search-filter' onClick={openPriceFilter}>Prices</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={ { mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
        {(title) && (
          <TitleSearchFilter />
        )}
        {location && (
          <LocationSearchFilter />
        )}
        {bedroom && (
          <BedroomFilter />
        )}
        {date && (
          <DatesFilter />
        )}
        {price && (
          <PricesFilter />
        )}
      </Box>
      <Button color='neutral' variant='outlined' sx={ { mt: 3 } } onClick={closeSearch}>
        CANCEL
      </Button>
    </ThemeProvider>
  )
}
