// https://docs.cypress.io/api/table-of-contents
/// <reference types="cypress" />

describe('Register E2E test suite', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/register')
  })



  it('Display validation errors for empty fields', () => {
    cy.get('button').click()


    const errorMessages = [
      'Username is required',
      'email is required',
      'password is required'
   ]  
    errorMessages.forEach(message => {
      cy.contains('span[role="alert"]', message).should('be.visible')
    })

  })

  // This will be changed to an API call once the backend is implemented.
 // it('Submit form sucessfully and log console with valid inputs', () => {
  //  cy.window().then((win) =>{
  //    cy.stub(win.console, 'log').as('console')
 //   })
 //   cy.get('input[name="username"]').type('testuser')
  //  cy.get('input[name="email"]').type('testuser@example.com')
  //  cy.get('input[name="password"]').type('password123')
  //  cy.get('button').should('not.be.disabled').click()

   // cy.get('@console').should('be.calledWith', {
    //  username: 'testuser',
    //  email: 'testuser@example.com',
  //    password: 'password123'
 // })
//})

// -------------------------------------------------- API CALL TESTS TO BE IMPLEMNTED --------------------------------------------------------
  // cy.wait('@register', { timeout: 10000}).its('request.body').should('deep.equal', {
    //  username: 'testuser',
    //  email: 'testuser@example.com',
    //  password: 'password123'

    //})

    //cy.contains('Registration successful').should('be.visible')

    // cy.intercept('POST', '/register', { statusCode: 200, body: {message: 'Registration successful' } }).as('register')

})
