import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Box, Card, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Root from './Root'
import { EditBedroomCard } from './EditBedroomCard';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1lr;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  maxHeight: 25%;
`

const DisplayCards = styled(Card)`
  width: 50%;
  padding: 5px 5px;
  border: 1px solid black;
`

const StyledCard = styled(Card)`
  width: 25vw;
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
export const EditBedroomsModal = ({ bedroom, bedrooms, setBedrooms, number }) => {
  const [open, setOpen] = useState(false);
  const [beds, setBeds] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
    const copyOf = [...bedrooms];
    const index = copyOf.indexOf(bedroom);
    copyOf[index] = beds;
    setBedrooms(copyOf);
  }

  const removeBed = (e) => {
    e.stopPropagation();
    const copyOf = [...bedrooms];
    copyOf.splice(number, 1);
    setBedrooms(copyOf);
  }

  function addBeds () {
    setBeds([...bedroom, { bedType: '', number: '' }]);
  }

  useEffect(() => {
    setBeds([...bedroom]);
  }, [])

  return (
    <>
     <DisplayCards onClick={handleClick}>
      <CardHeader>
        <Typography variant='h7'> Bedroom {number + 1}</Typography>
        <Button size='small' sx={{ minWidth: '10px', padding: 0, justifyContent: 'right' }} onClick={removeBed}> x </Button>
      </CardHeader>
      {bedroom.map((bed, idx) => (
        <>
        <Typography variant='h8' key={idx}> {bed.number} x {bed.bedType}</Typography>
        <br></br>
        </>
      ))}
    </DisplayCards>
      <Modal open={open}>
        <Root>
          <StyledCard>
            <Header>
                <Typography variant="h5"> Bedroom {number + 1}
                <IconButton variant="contained" color="neutral" onClick={addBeds}> <AddOutlinedIcon /> </IconButton></Typography>
              <IconButton onClick={handleClose}> <CloseIcon /> </IconButton>
            </Header>
            <InnerBox>
              {beds.map((bed, i) => (
                <EditBedroomCard bed={bed} bedroom={beds} setBedroom={setBeds} idx={i} key={i}/>
              ))}
            </InnerBox>
            <Footer>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={ { mr: 2, mt: 2 } }
              >
                  Save
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

EditBedroomsModal.propTypes = {
  bedroom: PropTypes.array,
  bedrooms: PropTypes.array,
  setBedrooms: PropTypes.func,
  number: PropTypes.number
}
