import React, { useState } from 'react';
import { headerStyle, formCenter, rowStyle } from '../styles/authStyles';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material';
import { makeRequest } from '../helpers/helpers.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../styles/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert } from '../components/Alert';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }

  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const loginUser = async () => {
    const res = await makeRequest('user/auth/login', 'POST', {
      email,
      password
    });
    if (res.error) {
      handleErrMsg(res.error);
      handleOpenAlert();
    } else {
      localStorage.setItem('token', res.token);
      navigate('/home');
    }
  }

  return (
    <div style={ { textAlign: 'center' } }>
      <ThemeProvider theme={theme}>
        <Typography variant='h1' style={headerStyle} sx={ { m: 4 } }>
          <Link to='/' style={ { textDecoration: 'none', color: '#FF5A5F' } }>AirBrB</Link>
        </Typography>
        <Typography variant='subtitle1' sx={ { m: 4 } }>Welcome to AirBrB!</Typography>
        <div style={formCenter}>
          <form onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}>
            <table>
              <tbody>
                <tr style={rowStyle}>
                  <Typography sx={ { mr: 1 } }>Email</Typography>
                  <td><TextField id='email' type='text' size='small' onChange={(event) => setEmail(event.target.value)}
                    value={email} placeholder='example@gmail.com' /></td>
                </tr>
                <tr style={rowStyle}>
                  <Typography sx={ { mr: 2 } }>Password</Typography>
                  <td><TextField id='password' type='password' size='small' onChange={(event) => setPassword(event.target.value)}
                    value={password} placeholder='*******' /></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <Button variant='contained' color='primary' sx={ { mt: 4, mb: 5 } } onClick={loginUser}>LOGIN</Button>
        <Typography>Not a member with us? <Link to='/register' id='#register-link' style={ { color: '#00A699' } }>Register here!</Link></Typography>
        {openAlert &&
          <Alert msg={errMsg} toggleModal={handleOpenAlert} />
        }
      </ThemeProvider>
    </div>
  );
}
