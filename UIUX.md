UI/UX Improvement attempts:
General:
- Grid layout of cards change depending on screen size (e.g. mobile screen of 400px in width will only have 1 column, while a full size desktop screen will see 4 columns of listing cards)
- Clicking the AirBrB logo/text at the top of any page/on the nav bar will take the user back to the home page - this makes it consistent/intuitive with other websites
- Consistent colour scheme which mimics AirBnB colours to avoid overusing too many colours, or using colours which don't complement each other
- Buttons with a positive conotation (e.g. PUBLISH) have a brighter colours, whereas buttons with a negative conotation (e.g. CANCEL or REMOVE) have a neutral grey colour (or outline design) to avoid drawing attention to them.
- When the user is not logged in, they cannot navigate to any other pages even if they manually change the URL - this is to prevent the user from completing any unauthorised actions
- A logged out user will only see an option to LOGIN on the navbar, while a logged in user will see a menu which will allow them to navigate to other pages/log out of AirBrB
- One consistent font (Inter/Open Sans) is used for the entire website
- Error alerts appear with error messages displayed to let the user know what went wrong (especially when communicating with backend)
- Consistent navbar across all pages
Booking Listings:
- All dates in the past and dates which the listing is not available for are disabled to prevent the user from choosing them
- If the user is the owner of the listing, the BOOKING button is disabled to prevent them from trying to book their own listing
Booking Requests:
- Accept/Reject booking requests buttons disabled once the user has accepted or rejected the booking - the user shouldn't be able to reject a booking that they have already accepted
- Pending bookings are shown at the top so that the user can more easily see which requests they have not processed
- If a listing is not published, then there won't be a BOOKINGS button for the user to see booking requests, since it is not possible for other users to book an unpublished listing
Search Filters:
- Search button is disabled on pages other than Home page as search filter cannot be used in other pages
- Search filters are located at the top of the page, with all listings at the bottom to give the users a sense of what kind of listings they might want to look at
- All search filter options are displayed on the screen to show the user what options they have regarding listings searching/filtering
- When there are no results that match the user's search, a message appears on the screen to prompt the user to search for something else
Login/Register: 
- Placeholder text on the form for name and email to show the user examples of what to input (learnability)

Accessibility:
- aria-labels and alt text are used wherever applicable to assist screen readers/cases where images don't load