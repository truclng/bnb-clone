import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Button, Card, Chip, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Root from './Root'

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 1lr;
`;

const StyledCard = styled(Card)`
    width: 50vw;
    max-height: 50vh;
    padding: 2em;
    text-align: left;
`;

const InnerBox = styled(Box)`
  max-height: 30vh; 
  overflow: scroll;
`

const Footer = styled.div`
  position: static;
  bottom: 0px;
`

export const BookingLabel = booking => {
  const [open, setOpen] = useState(false);
  const status = (booking.booking.status).toUpperCase();

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => setOpen(false)
  return (
    <>
    {status === 'PENDING'
      ? <Chip label={`Booking ${status}`} sx={{ mt: 2, mr: 2 }} onClick={handleOpen}/>
      : <Chip label={`Booking ${status}`} sx={{ mt: 2, mr: 2 }} color='success' onClick={handleOpen}/>
    }
    <Modal open={open}>
    <Root>
          <StyledCard>
            <Header>
                <Typography variant="h5"> Booking #{booking.booking.id} </Typography>
              <IconButton onClick={handleClose}> <CloseIcon /> </IconButton>
            </Header>
            <InnerBox>
              <Typography> Start: {booking.booking.dateRange.start} </Typography>
              <Typography> End: {booking.booking.dateRange.end} </Typography>
              <Typography> Total Price: ${booking.booking.totalPrice} </Typography>
              <Typography> Status: {status} </Typography>
            </InnerBox>
            <Footer>
              <Button
                variant="contained"
                color="neutral"
                onClick={handleClose}
                sx={ { mr: 2, mt: 2 } }
              >
                  Close
              </Button>
            </Footer>
          </StyledCard>
        </Root>
    </Modal>
    </>
  )
}

BookingLabel.propTypes = {
  booking: PropTypes.object
}
