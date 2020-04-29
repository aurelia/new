/// <reference types="Cypress" />

context('my-app', () => {
  it('shows message', () => {
    cy.visit('/');
    cy.wait(500);
    // @if shadow-dom
    cy.shadowGet('my-app').shadowFind('div').shadowContains('Hello World!');
    // @endif
    // @if !shadow-dom
    cy.get('my-app>div').contains('Hello World!');
    // @endif
  });
});
