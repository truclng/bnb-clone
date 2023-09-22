import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormControl, IconButton, MenuItem, Select, TextField, ThemeProvider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { theme } from '../styles/styles';

const StyledSpan = styled.span`
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const AddBedroomCard = ({ bedroom, setBedroom, idx }) => {
  const [bedType, setBedType] = useState('');
  const [number, setNumber] = useState('');
  const [visible, setVisible] = useState(true);
  const removeComponent = () => {
    setVisible((prev) => !prev);
    const copyOf = [...bedroom]
    copyOf.splice(idx, 1)
    setBedroom(copyOf)
  }
  useEffect(() => {
    if (bedType && number) {
      const bedConfig = { bedType, number };
      const copyOf = [...bedroom];
      copyOf[idx] = bedConfig;
      setBedroom(copyOf);
    }
  }, [bedType, number]);

  const handleBedType = (e) => setBedType(e.target.value);
  const handleNumber = (e) => setNumber(e.target.value);

  return (
    <>
    {visible && (
      <ThemeProvider theme={theme}>
        <FormControl>
          <StyledSpan>
          <TextField id='outlined-basic' label='Bed Type' variant='outlined'
            value={bedType}
            onChange={(e) => handleBedType(e)}
          />
          <Select
            value={number}
            onChange={(e) => handleNumber(e)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
          </Select>
          <IconButton variant='contained' color='neutral' onClick={removeComponent}> <DeleteIcon /> </IconButton>
          </StyledSpan>
        </FormControl>
      </ThemeProvider>
    )}
   </>
  );
}

AddBedroomCard.propTypes = {
  bedroom: PropTypes.array,
  setBedroom: PropTypes.func,
  idx: PropTypes.number
}
