//import { GoogleSocialLogin } from 'cypress-social-logins/src/Plugins'

describe('complete e to e test', () => {
    it('Visit the homepage, login, watch a page and logout', () => {
        cy.visit('/')
        cy.contains('The missing knowledge base for GSuite')
        cy.contains('Login')
        cy.contains('Sign in with Google').click()
        cy.get('.Spinner').find('.Spinner-spinner')

        cy.wait(1000)
        cy.contains('New Page')
        cy.contains('Your Work')
        cy.contains('My Fulcrum')
        cy.get('aside.App-sidebar ul > li > a')
            .contains('My Fulcrum')
            .click()

        cy.wait(1000)
        cy.contains('Welcome to your personal wiki')

        cy.get('input[aria-label="Search"]').click()
        cy.get('#SearchAutocomplet__list')
            .find('li')
            .first()
            .contains('My Fulcrum')

        cy.contains('Shared With Me').click()
        cy.wait(100)
        cy.contains('Shared can view').click()
        cy.wait(1000)
        cy.contains('Readonly')

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
