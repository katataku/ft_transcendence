describe('Game - Match Test', () => {
    beforeEach(() => {

    })

    it('can access game page', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.contains('PONG')
    })

    it('can join matching queue', () => {
        cy.visit('/')
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        cy.contains('matching...')
    })

    it('can match and play', () => {
        /*==== Can join queue ====*/
        cy.visit('/')
        // guest 1 login and join queue
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        // guest 1 logout
        cy.go('back')
        cy.get('button[data-cy="signOut-button"]').click()
        /*==== Can Match ====*/
        // guest 2 login and join queue
        cy.get('button[data-cy="login-as-guest2"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        // matching success
        cy.contains('Match History')
        // guest 2 click ready
        cy.get('button[data-cy="ready-button"]').click({ multiple: true })
        // guest 2 logout
        cy.go('back')
        cy.get('button[data-cy="signOut-button"]').click()
        /*==== Can Play ====*/
        // guest 1 login and click ready
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="ready-button"]').click({ multiple: true })
        // start game successful (contains countdown)
        cy.contains('3')
    })
})