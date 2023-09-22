import React from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { Slider, ThemeProvider } from '@mui/material';
import { theme } from '../../styles/styles';
import { Context } from '../../pages/Home';
import { CloseContext } from '../homeNavBar';

const beds = [
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 3,
    value: 3,
  },
  {
    label: 4,
    value: 4,
  },
  {
    label: 5,
    value: 5,
  },
  {
    label: 6,
    value: 6,
  },
  {
    label: 7,
    value: 7,
  },
  {
    label: 8,
    value: 8,
  },
  {
    label: 9,
    value: 9,
  },
  {
    label: 10,
    value: 10,
  },
];

export const BedroomFilter = () => {
  const closeSearch = React.useContext(CloseContext);
  const [bedroomNo, setBedroomNo] = React.useState([1, 4]);
  const handleBedNoChange = (event, newValue) => {
    setBedroomNo(newValue);
  }

  const bedroomFilterMatch = (listing) => {
    const bedrooms = listing.metadata.bedrooms;
    if (bedrooms !== undefined) {
      const totalBedrooms = bedrooms.length;
      const minBeds = bedroomNo[0];
      const maxBeds = bedroomNo[1];
      if (totalBedrooms >= minBeds && totalBedrooms <= maxBeds) {
        return true;
      } else {
        return false;
      }
    }
  }

  const { published, setSearch, setResults } = React.useContext(Context);
  const matches = [];
  const searchByBedrooms = () => {
    setSearch(true);
    published.forEach((listing) => {
      if (bedroomFilterMatch(listing)) {
        matches.push(listing);
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Slider
        value={bedroomNo}
        onChange={handleBedNoChange}
        valueLabelDisplay='auto'
        min={1}
        max={10}
        sx={ { width: '35vw' } }
        marks={beds}
      >
      </Slider>
      <Button
        color='primary'
        variant='contained'
        sx={ { ml: 3 } }
        onClick={() => {
          searchByBedrooms();
          setResults(matches);
          closeSearch();
        }}
      >
        <SearchIcon />
      </Button>
    </ThemeProvider>
  );
}
