/// <reference types="Cypress" />

context('The app', () => {
  it('shows message', () => {
    cy.visit('/');
    // @if shadow-dom-open || shadow-dom-closed
    cy.shadowGet('my-app').shadowFind('div').shadowContains('Hello World!');
    // @endif
    // @if !shadow-dom-open && !shadow-dom-closed
    cy.get('my-app>div').contains('Hello World!');
    // @endif
  });
});
