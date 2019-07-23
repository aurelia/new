/// <reference types="Cypress" />

context('The app', () => {
  it('shows message', () => {
    cy.visit('/');
    cy.get('app>div').contains('Hello World!');
  });
});
