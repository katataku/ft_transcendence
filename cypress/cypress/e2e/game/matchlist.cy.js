describe('Game - MatchList Test', () => {
    beforeEach(() => {

    })

    it('can view matchList', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-matchList"]').click()
        cy.contains('Ongoing Matches')
    })

    it('can view real match', () => {
        cy.visit('/')
        // guest 4 join queue
        cy.get('button[data-cy="login-as-guest4"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        // guest 4 sign out
        cy.go('back')
        cy.get('button[data-cy="signOut-button"]').click()
        // guest3 join queue
        cy.get('button[data-cy="login-as-guest3"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        // guest 3 press ready (should be matched with guest 4)
        cy.get('button[data-cy="ready-button"]').click({ multiple: true })
        // guest 3 sign out
        cy.go('back')
        cy.get('button[data-cy="signOut-button"]').click()
        // log in guest 4 to press ready
        cy.get('button[data-cy="login-as-guest4"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="ready-button"]').click({ multiple: true })
        // guest 4 sign out
        cy.go('back')
        cy.get('button[data-cy="signOut-button"]').click()
        // guest 1 sign in and view match list
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-matchList"]').click()
        // guest4 vs guest 3 match exists
        cy.contains('guest4 vs guest3')
        // view ongoing match
        cy.get('.list-group-item').contains('guest4 vs guest3').click()
        cy.contains('Match History')
    })
})