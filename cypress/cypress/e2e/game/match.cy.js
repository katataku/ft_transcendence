describe('Game - Match Test', () => {
    beforeEach(() => {

    })

    it('can join matching queue', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamepage"]').click()
        cy.contains('PONG')
        cy.get('button[data-cy="play-button"]').click()
        cy.contains('matching...')
    })
})