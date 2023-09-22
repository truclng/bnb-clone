import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { Typography } from '@mui/material';

export const ImageCarousel = ({ pictures }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  console.log(pictures)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    pictures === undefined
      ? <Box>
        <Typography> No pictures uploaded!</Typography>
      </Box>
      : <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
      >
        {pictures.map((step, index) => (
         <Box
          key={index}
          component="img"
          sx={{
            height: 255,
            display: 'block',
            maxWidth: 400,
            overflow: 'hidden',
            width: '100%',
          }}
          src={step.img}
          alt={step.label}
        />
        )
        )}
      </SwipeableViews>
      <MobileStepper
        steps={pictures.length}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            id='next-btn'
            data-testid = '1'
            size="small"
            onClick={handleNext}
            disabled={activeStep === pictures.length - 1}
          >
            {theme.direction === 'rtl'
              ? (<KeyboardArrowLeft />)
              : (<KeyboardArrowRight />)
            }
          </Button>
        }
        backButton={
          <Button
            data-testid='2'
            id='back-btn'
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}>
            {theme.direction === 'rtl'
              ? (<KeyboardArrowRight />)
              : (<KeyboardArrowLeft />)
            }
          </Button>
        }
      />
    </Box>
  );
}

ImageCarousel.propTypes = {
  pictures: PropTypes.array
}
