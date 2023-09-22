/// <reference types="cypress" />

describe('spec user happy path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/');
    cy.url().should('include','localhost:3000');
  });

  it('Happy Path', () => {

    // Registering for an account
    cy.get('button').contains('Login').click();
    cy.get('a').contains('Register here!').click();
    cy.get('input[name="name"]')
      .focus()
      .type('Test');
    cy.get('input[name="email"]')
      .focus()
      .type('test@gmail.com');
    cy.get('input[name="password"]')
      .focus()
      .type('123');
    cy.get('input[name="confirm-password"]')
      .focus()
      .type('123');
    cy.get('button').contains('REGISTER').click();

    cy.get('[id=home-menu-btn]').click();
    cy.get('[id=hostings-nav]').click();
    cy.get('[id=new-hosting]').click();

    // Creating the first listing 
    cy.get('[id=title]').focus().type('TEST')
    cy.get('[id=address]').focus().type('TEST')
    cy.get('[id=price]').focus().type('1000')
    cy.get('label[id=upload-file]').selectFile('cypress/fixtures/Villa.jpeg')
    cy.get('[id=create]').click()

    // Editing the previous hosting 
    cy.get('[id=edit-hosting]').click()
    cy.get('[id=title]').focus().type(' UPDATED')
    cy.get('label[id=update-thumbnail]').selectFile('cypress/fixtures/Villa1.jpeg')
    cy.get('[id=save]').click()
    cy.wait(2000)

    // Selecting avaliabilities for publish
    cy.get('[id=open-publish-modal]').click()
    cy.get("[id=startPicker]").click().focus().type('25/12/2022')
    cy.get("[id=endPicker]").click().focus().type('28/12/2022')
    cy.get('[id="publish-btn"]').click();
    cy.get('[id=unpublish-btn]').click();

    // Logout original user
    cy.get('[id=home-menu-btn]').click();
    cy.get('[id=logout-nav]').click();

    cy.wait(2000)

    // Creation of a new user and a listing so original user can make a booking!
    cy.get('button').contains('Login').click();
    cy.get('a').contains('Register here!').click();
    cy.get('input[name="name"]')
      .focus()
      .type('Test1');
    cy.get('input[name="email"]')
      .focus()
      .type('test1@gmail.com');
    cy.get('input[name="password"]')
      .focus()
      .type('123');
    cy.get('input[name="confirm-password"]')
      .focus()
      .type('123');
    cy.get('button').contains('REGISTER').click();

    cy.get('[id=home-menu-btn]').click();
    cy.get('[id=hostings-nav]').click();
    cy.get('[id=new-hosting]').click();

    // Creating a new listing 
    cy.get('[id=title]').focus().type('TEST2')
    cy.get('[id=address]').focus().type('TEST2')
    cy.get('[id=price]').focus().type('1000')
    cy.get('label[id=upload-file]').selectFile('cypress/fixtures/Villa1.jpeg')
    cy.get('[id=create]').click()

    // Selecting avaliabilities for publishing 
    cy.get('[id=open-publish-modal]').click()
    cy.get("[id=startPicker]").click().focus().type('25/12/2022')
    cy.get("[id=endPicker]").click().focus().type('28/12/2022')
    cy.get('[id="publish-btn"]').click();

    cy.get('[id=home-menu-btn]').click();
    cy.get('[id=logout-nav]').click();

    cy.wait(2000)

    // Original user now logs back in 
    cy.get('button').contains('Login').click();
    cy.get('[id="email"]')
      .focus()
      .type('test@gmail.com');
    cy.get('[id="password"]')
      .focus()
      .type('123');
    cy.get('button').contains('LOGIN').click();
    cy.wait(2000)

    // Click on listing
    cy.get('h5').contains('TEST2').click();

    cy.get("[id=startBooking]").click().focus().type('25/12/2022')
    cy.get("[id=endBooking]").click().focus().type('28/12/2022')
    cy.get("button[id=reserve-booking]").click()
    cy.get('button').contains('RETURN').click()
    cy.get('[id=home-menu-btn]').click();
    cy.get('[id=all-bookings-nav]').click();
  })
});

// Registers successfully
// Creates a new listing successfully
// Updates the thumbnail and title of the listing successfully
// Publish a listing successfully
// Unpublish a listing successfully
// Make a booking successfully
// Logs out of the application successfully
// Logs back into the application successfully