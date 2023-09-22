import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormControl, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const StyledSpan = styled.span`
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const AddAvaliabilitiesCard = ({ availabilities, setAvailabilities, idx }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [visible, setVisible] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const removeComponent = () => {
    setVisible((prev) => !prev);
    const copyOf = [...availabilities];
    copyOf.splice(idx, 1);
    setAvailabilities(copyOf);
  }

  function startFilled () {
    return setDisabled(start === null);
  }

  useEffect(() => {
    if (start && end) {
      const range = { start: new Date(start).toLocaleString().split(',')[0], end: new Date(end).toLocaleString().split(',')[0] }
      const copyOf = [...availabilities];
      copyOf[idx] = range;
      setAvailabilities(copyOf);
      console.log(availabilities);
    }
  }, [start, end]);

  useEffect(() => {
    setMinDate(start);
    startFilled();
  }, [start]);

  const handleStartDate = (value) => setStart(value);
  const handleEndDate = (value) => setEnd(value);

  return (
    <>
    {visible && (
      <FormControl>
        <StyledSpan>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="From"
            value={start}
            minDate={new Date()}
            inputFormat="DD/MM/YYYY"
            onChange={(newValue) => handleStartDate(newValue)}
            disablePast
            renderInput={(params) => <TextField id='startPicker'{...params} />}
            sx={ { mr: 2 } }
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="To"
            value={end}
            disabled={disabled}
            minDate={minDate}
            inputFormat="DD/MM/YYYY"
            onChange={(newValue) => handleEndDate(newValue)}
            disablePast
            renderInput={(params) => <TextField id='endPicker'{...params} />}
          />
        </LocalizationProvider>
        <IconButton variant='contained' color='neutral' onClick={removeComponent}> <DeleteIcon /> </IconButton>
        </StyledSpan>
      </FormControl>
    )}
   </>
  )
}

AddAvaliabilitiesCard.propTypes = {
  availabilities: PropTypes.array,
  setAvailabilities: PropTypes.func,
  idx: PropTypes.number
}
