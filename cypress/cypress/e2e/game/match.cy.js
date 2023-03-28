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

    // DBにguest1とguest2の本当のマッチを実現
    it('can match', () => {
        cy.visit('/')
        // guest 1 login and join queue
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        // guest 1 logout
        cy.go('back')
        cy.get('button[data-cy="signOut-button"]').click()
        // guest 2 login and join queue
        cy.get('button[data-cy="login-as-guest2"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="play-button"]').click()
        // matching successful
        cy.contains('Match History')
    })

    it('can play', () => {
        cy.visit('/')
        // guest 1 login and click ready (match created above)
        cy.get('button[data-cy="login-as-guest1"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="ready-button"]').click({ multiple: true })
        // guest 1 sign out
        cy.go('back')
        cy.get('button[data-cy="signOut-button"]').click()
        // guest 2 login and click ready (match created above)
        cy.get('button[data-cy="login-as-guest2"]').click()
        cy.get('a[data-cy="link-to-gamePage"]').click()
        cy.get('button[data-cy="ready-button"]').click({ multiple: true })
        // start game (countdown) successful
        cy.contains('3')
    })
})