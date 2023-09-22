import React from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, ThemeProvider } from '@mui/material';
import { theme } from '../../styles/styles';
import { Context } from '../../pages/Home';
import { CloseContext } from '../homeNavBar';

export const TitleSearchFilter = () => {
  const closeSearch = React.useContext(CloseContext);
  const [title, setTitle] = React.useState('');
  const handleChange = (event) => {
    setTitle(event.target.value);
  }

  const { published, setSearch, setResults } = React.useContext(Context);
  const matches = [];
  const searchByTitle = () => {
    setSearch(true);
    published.forEach((listing) => {
      if (listing.title.toLowerCase() === title.toLowerCase()) {
        matches.push(listing);
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <TextField
        label='Enter Property Title'
        value={title}
        onChange={handleChange}
        variant='standard'
      />
      <Button
        color='primary'
        variant='contained'
        sx={ { ml: 2 } }
        onClick={() => {
          searchByTitle();
          setResults(matches);
          closeSearch();
        }}
      >
        <SearchIcon />
      </Button>
    </ThemeProvider>
  );
}
