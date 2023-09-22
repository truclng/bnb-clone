import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/styles';
import { Link, useNavigate } from 'react-router-dom';
import { makeRequest } from '../helpers/helpers';
import { Alert } from './Alert';
import { SearchFilter } from './searches/SearchFilter';
import { Context } from '../pages/Home';

export const CloseContext = React.createContext(null);

export const NavBar = ({ isHome, setHome, setLoading, setToken }) => {
  const token = localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyHostings = () => {
    navigate('/hostings');
  }

  const handleMyBookings = () => {
    navigate('/bookings/all');
  }

  const [openAlert, setOpenAlert] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const navigate = useNavigate();

  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }

  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const loginNav = () => {
    navigate('/login');
  }

  const logoutUser = async () => {
    const res = await makeRequest('user/auth/logout', 'POST');
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      handleClose();
      navigate('/');
      localStorage.removeItem('token');
      if (setToken) {
        setToken(null);
      }
      if (setLoading) {
        setLoading(true);
      }
      setHome(true);
    }
  }

  const [searchFilter, setSearchFilter] = React.useState(false);
  const openSearchFilter = () => {
    setSearchFilter(true);
  }
  const closeSearchFilter = () => {
    setSearchFilter(false);
  }

  const { display, setDisplay, booked, setBooked, setSearch } = React.useContext(Context);

  return (
    <ThemeProvider theme={theme}>
      <AppBar id='nav-bar' color='primary'>
        <Toolbar>
          <Typography variant='h3' sx={ { flexGrow: 1 } }>
            <Link to='/' onClick={ () => setHome(true) } style={ { textDecoration: 'none', color: 'white' } }>AirBrB</Link>
          </Typography>
          <Button
            variant='contained'
            color='primary'
            sx={ { mr: 2 } }
            disabled={!isHome}
            id='search-filter-btn'
            onClick={() => {
              setSearch(false);
              openSearchFilter();
              setBooked(booked);
              setDisplay(display);
            }}
          >
            <SearchIcon />
          </Button>
          {token && (
            <div>
              <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                id='home-menu-btn'
                aria-haspopup='true'
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem id='hostings-nav' onClick={handleMyHostings}>My hostings</MenuItem>
                <MenuItem id='all-bookings-nav' onClick={handleMyBookings}>My bookings</MenuItem>
                <MenuItem id='logout-nav' onClick={logoutUser}>Logout</MenuItem>
              </Menu>
            </div>
          )}
          {!token && (
            <Button color='inherit' onClick={loginNav}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      {searchFilter && (
        <div style={ { textAlign: 'center', marginTop: 10 } }>
          <CloseContext.Provider value={closeSearchFilter}>
            <SearchFilter />
          </CloseContext.Provider>
        </div>
      )}
      {openAlert &&
        <Alert msg={errMsg} toggleModal={handleOpenAlert} />
      }
    </ThemeProvider>
  );
}

NavBar.propTypes = {
  isHome: PropTypes.bool,
  setHome: PropTypes.func,
  setToken: PropTypes.func,
  setLoading: PropTypes.func,
}
