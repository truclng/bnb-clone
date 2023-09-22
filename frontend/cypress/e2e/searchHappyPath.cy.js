import 'cypress-localstorage-commands';

describe('Search Filter Happy Path', () => {
  it('navigates to landing screen successfully', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include','localhost:3000');
  });

  it('goes to login page successfully', () => {
    cy.get('button').contains('Login').click();
    cy.url().should('include', 'localhost:3000/login');
  });

  it('registers successfully', () => {
    cy.get('a').contains('Register here!').click();
    cy.url().should('include', 'localhost:3000/register');
    cy.get('input[name="name"]')
      .focus()
      .type('Happy');
    cy.get('input[name="email"]')
      .focus()
      .type('happy@gmail.com');
    cy.get('input[name="password"]')
      .focus()
      .type('123');
    cy.get('input[name="confirm-password"]')
      .focus()
      .type('123');
    cy.get('button').contains('REGISTER').click();
    cy.url().should('include', 'localhost:3000/home');
    cy.saveLocalStorage('logged in');
  });

  it('searches for listings using price filters successfully and books their desired listing', () => {
    cy.restoreLocalStorage('logged in');
    cy.wait(15000);
    cy.get('[id=search-filter-btn]').click();
    cy.get('[id=price-search-filter]').click();
    cy.get('[id=price-from-input]')
      .focus()
      .type(200);
    cy.get('[id=price-to-input]')
      .focus()
      .type(1250);
    cy.get('[id=search-price-enable-btn]').click();
    cy.get('h5').contains('Meriton Penthouse').click();
    cy.get('[id=startBooking]')
      .focus()
      .type('22/11/2022');
    cy.get('[id=endBooking]')
      .focus()
      .type('25/11/2022');
    cy.get('button').contains('RESERVE').click();
  });

  it('logs out successfully after booking the listing', () => {
    cy.restoreLocalStorage('logged in');
    cy.get('[id=home-menu-btn]').click();
    cy.get('[id=logout-nav]').click();
    cy.url().should('include', 'localhost:3000/');
    cy.removeLocalStorage('logged in');
  });

  it('logs in again successfully', () => {
    cy.get('button').contains('Login').click();
    cy.get('input[name="email"]')
      .focus()
      .type('happy@gmail.com');
    cy.get('input[name="password"]')
      .focus()
      .type('123');
    cy.get('button').contains('LOGIN').click();
    cy.url().should('include', 'localhost:3000/home');
    cy.saveLocalStorage('second logged in view');
  });

  it('selects the listing booked to view status successfully', () => {
    cy.restoreLocalStorage('second logged in view');
    cy.wait(10000);
    cy.get('h5').contains('Meriton Penthouse').click();
    cy.url().should('contain', 'localhost:3000/listing/');
  });

});
