import React from 'react'
import PropTypes from 'prop-types';
import { Card, Typography, ThemeProvider } from '@mui/material';
import styled from 'styled-components';
import { theme } from '../styles/styles';

const StyledCard = styled(Card)`
  width: 50%;
  padding: 5px 5px;
  border: 1px solid black;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  maxHeight: 25%;
`

export const BedroomCard = ({ bedroom, number }) => {
  return (
    <ThemeProvider theme={theme}>
      <StyledCard aria-label='bedroom details display card'>
        <Header>
          <Typography variant='h7'> Bedroom {number + 1}<br></br></Typography>
        </Header>
        {bedroom.map((bed, idx) => (
          <>
          <Typography variant='h8' key={idx}> {bed.number} x {bed.bedType}</Typography>
          <br></br>
          </>
        ))}
      </StyledCard>
    </ThemeProvider>
  )
}

BedroomCard.propTypes = {
  bedroom: PropTypes.array,
  number: PropTypes.number
}
