/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {
  beforeEach(() => {
  })


  it('can create new room', () => {
    const newRoomName = 'cypress test room'
    cy.visit('/')
    cy.get('button[data-cy="login-as-guest1"]').click()
    cy.get('a[data-cy="link-to-chatlist"]').click()
    cy.get('button[data-cy="create-room-button"]').click()
    cy.get('input[placeholder="New Room Name"]').type(`${newRoomName}`)
    cy.get('button[data-cy="chat-room-submit-button"]').click()
    cy.contains(`${newRoomName}`)
  })
})
