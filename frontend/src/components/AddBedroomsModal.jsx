import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Button, Card, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Root from './Root'
import { AddBedroomCard } from './AddBedroomCard';

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
export const AddBedroomsModal = ({ bedrooms, setBedrooms }) => {
  const [open, setOpen] = useState(false);
  const [beds, setBeds] = useState([]);
  const [bedroom, setBedroom] = useState([]);

  const handleClose = () => {
    setOpen(false);
    setBeds([])
  };

  const handleClick = () => setOpen(true);

  const handleAdd = () => {
    setOpen(false);
    setBedrooms([...bedrooms, bedroom])
    setBedroom([])
    setBeds([])
  }

  function addBeds () {
    setBeds([...beds, { bedType: '', number: '' }])
  }
  return (
    <>
      <Button
          variant="contained"
          color="neutral"
          onClick={handleClick}
          sx={ { mt: 2 } }
      >
          Add
      </Button>
      <Modal open={open}>
        <Root>
          <StyledCard>
            <Header>
                <Typography variant="h5"> Bedroom {bedrooms.length + 1}
                <IconButton variant="contained" color="neutral" onClick={addBeds}> <AddOutlinedIcon /> </IconButton></Typography>
              <IconButton onClick={handleClose}> <CloseIcon /> </IconButton>
            </Header>
            <InnerBox>
              <AddBedroomCard bedroom={bedroom} setBedroom={setBedroom} idx={0}/>
              {beds.map((item, i) => (
                <AddBedroomCard bedroom={bedroom} setBedroom={setBedroom} idx={i + 1} key={i}/>
              ))}
            </InnerBox>
            <Footer>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                sx={ { mr: 2, mt: 2 } }
              >
                  Add
              </Button>
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
  );
};

AddBedroomsModal.propTypes = {
  bedrooms: PropTypes.array,
  setBedrooms: PropTypes.func
}
