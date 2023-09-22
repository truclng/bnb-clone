import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5A5F',
    },
    secondary: {
      main: '#00A699',
    },
    neutral: {
      main: '#767676',
      contrastText: 'white',
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: 48
    },
    h2: {
      fontSize: 36
    },
    h3: {
      fontSize: 22
    },
    h5: {
      fontSize: 18
    },
    subtitle1: {
      fontSize: 24
    },
    body1: {
      fontSize: 16
    },
    body2: {
      fontSize: 13
    }
  },
  spacing: 5,
  components: {
    MuiTableRow: {
      height: 20
    },
    MuiTable: {
      borderSpacing: 1
    }
  }
});
