describe('Game - Matchlist Test', () => {
    beforeEach(() => {

    })

    it('can view matchlist', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-matchlist"]').click()
        cy.contains('Ongoing Matches')
    })
})