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

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleOpenAlert = () => {
    setOpenAlert(!openAlert);
  }
  const handleErrMsg = (msg) => {
    setErrMsg(msg);
  }

  const pwdCheck = (pwd1, pwd2) => {
    return pwd1 === pwd2;
  }

  // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const registerUser = async () => {
    if (!pwdCheck(password, confirmPwd)) {
      handleErrMsg('Your passwords don\'t match!');
      handleOpenAlert();
    } else if (!validateEmail(email)) {
      handleErrMsg('Please enter a valid email address!');
      handleOpenAlert();
    } else {
      const res = await makeRequest('user/auth/register', 'POST', {
        email,
        password,
        name
      });
      if (res.error) {
        handleErrMsg(res.error);
        handleOpenAlert();
      } else {
        localStorage.setItem('token', res.token);
        navigate('/home');
      }
    }
  }

  const loginReturn = () => {
    navigate('/login');
  }

  return (
    <div style={ { textAlign: 'center' } }>
      <ThemeProvider theme={theme}>
      <Typography variant='h1' style={headerStyle} sx={ { m: 4 } }>
          <Link to='/' style={ { textDecoration: 'none', color: '#FF5A5F' } }>AirBrB</Link>
        </Typography>
        <Typography variant='subtitle1' sx={ { m: 4 } }>Join our community!</Typography>
        <div style={formCenter}>
          <form onSubmit={(e) => {
            e.preventDefault();
            registerUser();
          }}>
            <table>
              <tbody>
                <tr style={rowStyle}>
                  <Typography>Name</Typography>
                  <td><TextField type='text' variant='outlined' size='small' onChange={(event) => setName(event.target.value)}
                    value={name} placeholder='John Smith' name='name' required/></td>
                </tr>
                <tr style={rowStyle}>
                  <Typography>Email</Typography>
                  <td><TextField type='email' variant='outlined' size='small' onChange={(event) => setEmail(event.target.value)}
                    value={email} placeholder='example@gmail.com' name='email' required/></td>
                </tr>
                <tr style={rowStyle}>
                  <Typography>Password</Typography>
                  <td><TextField type='password' variant='outlined' size='small' onChange={(event) => setPassword(event.target.value)}
                    value={password} placeholder='*******' name='password' required/></td>
                </tr>
                <tr style={rowStyle}>
                  <Typography sx={ { mr: 2 } }>Confirm Password</Typography>
                  <td><TextField type='password' variant='outlined' size='small' onChange={(event) => setConfirmPwd(event.target.value)}
                    value={confirmPwd} placeholder='*******' name='confirm-password' required /></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <Button variant='contained' color='primary' sx={ { mr: 2, mt: 4, mb: 3 } } onClick={registerUser}>REGISTER</Button>
        <Button variant='contained' color='neutral' sx={ { mt: 1 } } onClick={loginReturn}>RETURN</Button>
        {openAlert &&
          <Alert msg={errMsg} toggleModal={handleOpenAlert} />
        }
      </ThemeProvider>
    </div>
  );
}
