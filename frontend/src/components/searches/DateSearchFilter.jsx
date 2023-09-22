import React from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField, ThemeProvider } from '@mui/material';
import moment from 'moment/moment';
import { theme } from '../../styles/styles';
import { styled } from '@mui/system';
import { Context } from '../../pages/Home';
import { CloseContext } from '../homeNavBar';
import { useNavigate } from 'react-router-dom';

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '40vw',
  [theme.breakpoints.up('xs')]: {
    marginTop: 10,
    marginRight: 1
  },
  [theme.breakpoints.up('sm')]: {
    marginRight: 7
  },
  [theme.breakpoints.up('md')]: {
    width: '20vw',
    marginRight: 10
  },
}));

const formatQuery = str => str.replaceAll('/', '-');

export const DatesFilter = () => {
  const closeSearch = React.useContext(CloseContext);
  const [date1, setDate1] = React.useState(moment().startOf('day'));
  const [date2, setDate2] = React.useState(moment().startOf('day'));
  const navigate = useNavigate()

  const handleChangeDateFrom = (newValue) => {
    setDate1(newValue);
  }
  const handleChangeDateTo = (newValue) => {
    setDate2(newValue);
  }

  const { published, setSearch, setResults } = React.useContext(Context);
  const matches = [];
  const searchByDateRange = () => {
    setSearch(true);
    if (date1.isBefore(date2)) {
      published.forEach((listing) => {
        const availabilities = listing.availability;
        let isAvailable = false;
        availabilities.forEach((dateRange) => {
          const start = moment(dateRange.start, 'DD/MM/YYYY', true).format();
          const end = moment(dateRange.end, 'DD/MM/YYYY', true).format();
          if (date1.isBetween(start, end, undefined, '[]') &&
            date2.isBetween(start, end, undefined, '[]')) {
            if (!isAvailable) {
              isAvailable = true;
            }
          }
        });
        if (isAvailable) {
          matches.push(listing);
        }
      });
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DesktopDatePicker
          label='From'
          disablePast
          inputFormat='DD/MM/YYYY'
          value={date1}
          onChange={handleChangeDateFrom}
          renderInput={(params) => <StyledTextField {...params} />}
        />
        <DesktopDatePicker
          label='To'
          inputFormat='DD/MM/YYYY'
          disablePast
          value={date2}
          onChange={handleChangeDateTo}
          renderInput={(params) => <StyledTextField {...params} />}
        />
      </LocalizationProvider>
      <Button
        color='primary'
        variant='contained'
        onClick={() => {
          searchByDateRange();
          setResults(matches);
          navigate(`/?q=${formatQuery(moment(date1).format('L') + '+' + moment(date2).format('L'))}`);
          closeSearch();
        }}
      >
        <SearchIcon />
      </Button>
    </ThemeProvider>
  );
}
