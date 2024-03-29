//import { GoogleSocialLogin } from 'cypress-social-logins/src/Plugins'

describe('complete e to e test', () => {
    it('Visit the homepage, login, watch a page and logout', () => {
        cy.visit('/')
        cy.contains('Login')
        cy.contains('Sign in with Google').click()
        cy.get('.Spinner').find('.Spinner-spinner')

        cy.wait(1000)
        cy.contains('New Page')
        cy.contains('Your Work')
        cy.contains('My Wiki')
        cy.get('aside.App-sidebar ul > li > a').contains('My Wiki').click()

        cy.wait(1000)
        cy.contains('Welcome to your wiki')

        cy.get('input[aria-label="Search"]').click()
        cy.get('#SearchAutocomplete__MenuList')
            .find('li')
            .first()
            .contains('My Wiki')

        cy.contains('Shared With Me').click()
        cy.wait(100)
        cy.contains('Shared can view').click()
        cy.wait(1000)
        //cy.contains('Readonly')

        cy.contains('Shared With Me').click()
        cy.wait(100)
        cy.contains('Shared can comment').click()
        cy.wait(1000)
        cy.contains('Readonly')

        cy.contains('Shared With Me').click()
        cy.wait(100)
        cy.contains('Shared can edit').click()
        cy.wait(1000)
        cy.get('#Readonly-Chip').should('not.exist')

        cy.get('#LogoutButton').click()
    })
})
