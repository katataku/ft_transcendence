describe('Game - Match Test', () => {
    beforeEach(() => {

    })

    it('can access game page', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamepage"]').click()
        cy.contains('PONG')
    })

    it('can join matching queue', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamepage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        cy.contains('matching...')
    })

    it('can match', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamepage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        cy.go('back')
        cy.get('button[data-cy="signout-button"]').click()
        cy.get('button[data-cy="login-as-guest2"]').click()
        cy.get('a[data-cy="link-to-gamepage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        cy.contains('Match History') // users have matched
    })

    it('can play', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamepage"]').click()
        cy.get('button[data-cy="ready-button"]').click({ multiple: true })
        cy.go('back')
        cy.get('button[data-cy="signout-button"]').click()
        cy.get('button[data-cy="login-as-guest2"]').click()
        cy.get('a[data-cy="link-to-gamepage"]').click()
        cy.get('button[data-cy="ready-button"]').click({ multiple: true })
        cy.contains('3') // countdown
    })
})