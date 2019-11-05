//import { GoogleSocialLogin } from 'cypress-social-logins/src/Plugins'

describe('complete e to e test', () => {
    it('Visit the homepage, login, watch a page and logout', () => {
        cy.visit('/')
        cy.contains('Knowledge Base for Google Drive!')
        cy.contains('Login')
        cy.contains('Login with Google').click()
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

        cy.get('#LogoutButton').click()
    })
})
