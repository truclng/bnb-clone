import React from 'react';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export const BookingHistory = ({ postedDate, bookings }) => {
  const timeNow = moment();
  const onlineDuration = timeNow.diff(moment(postedDate), 'days');

  let daysBooked = 0;
  let profit = 0;

  bookings.forEach((booking) => {
    const startDate = moment(booking.dateRange.start, 'DD/MM/YYYY', true).format();
    const endDate = moment(booking.dateRange.end, 'DD/MM/YYYY', true).format();
    let duration = 0;
    const startOfBookingIsInYear = moment(startDate).format('YYYY') === timeNow.format('YYYY');
    if (booking.status === 'accepted') {
      if (startOfBookingIsInYear) {
        profit += booking.totalPrice;
      }
      if (startOfBookingIsInYear && moment(endDate).format('YYYY') === timeNow.format('YYYY')) {
        duration = moment(endDate).diff(startDate, 'days');
      } else if (startOfBookingIsInYear) {
        const endOfYear = moment(`31-12-${timeNow.format('YYYY')}`, 'DD-MM-YYYY');
        duration = endOfYear.diff(startDate, 'days');
      }
      daysBooked += duration;
    }
  });

  return (
    <TableContainer>
      <Table aria-label='Listing History'>
        <TableBody>
          <TableRow>
            <TableCell>Listing Online Duration</TableCell>
            {(onlineDuration === 0 || onlineDuration > 1) && (
              <TableCell align='right'>{onlineDuration} days</TableCell>
            )}
            {onlineDuration === 1 && (
              <TableCell align='right'>{onlineDuration} day</TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell>Number of Days Booked This Year</TableCell>
            <TableCell align='right'>{daysBooked}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Profit This Year</TableCell>
            <TableCell align='right'>$ {profit}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

BookingHistory.propTypes = {
  postedDate: PropTypes.string,
  bookings: PropTypes.arrayOf(PropTypes.object),
}
