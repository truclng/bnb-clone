import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';

const ITEM_HEIGHT = 25;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const allAmenities = [
  'Essentials',
  'Kitchen',
  'Air Conditioning',
  'Hair dryer',
  'Iron',
  'Dryer',
  'TV',
  'Indoor Fireplace',
  'Heating',
  'Hangers',
  'Washer',
  'Hot Water',
  'Cable TV',
  'Private Bathroom',
  'Private Living Room'
];

function getStyles (amenity, amenityList, theme) {
  return {
    fontWeight:
      amenityList.indexOf(amenity) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const EditAmenitiesBox = ({ amenities, setAmenities }) => {
  const theme = useTheme();
  const [amenitiesList, setAmenitiesList] = useState(amenities);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setAmenitiesList(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleDelete = (e, value) => {
    e.preventDefault();
    const copyOf = [...amenitiesList];
    const idx = amenitiesList.indexOf(value);
    copyOf.splice(idx, 1);
    setAmenitiesList(copyOf);
  };

  useEffect(() => {
    setAmenities(amenitiesList);
  }, [amenitiesList]);

  return (
    <>
      <Select sx={ { display: 'flex', height: '10vh', mb: 5, mt: 2 }}
        multiple
        value={amenities}
        onChange={handleChange}
        renderValue={(selected) => (
          <Box sx={{ height: '10vh', maxWidth: '100%', overflowY: 'scroll', display: 'flex', flexDirection: 'column' }}>
            {selected.map((value) => (
              <Chip sx={{ justifyContent: 'left', width: 'min-content', height: 'max-content' }}
              key={value}
              label={value}
              clickable
              deleteIcon={
                <CancelIcon
                  onMouseDown={(event) => event.stopPropagation()}
                />
              }
              onDelete={(e) => handleDelete(e, value)}
            />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {allAmenities.map((amenity) => (
          <MenuItem
            key={amenity}
            value={amenity}
            style={getStyles(amenity, amenitiesList, theme)}
          >
            {amenity}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

EditAmenitiesBox.propTypes = {
  amenities: PropTypes.array,
  setAmenities: PropTypes.func
}
