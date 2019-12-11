describe('Test the Editor', () => {
    it('Toggle the editor via shortcuts', () => {
        cy.visit('/')
        cy.contains('Sign in with Google').click()

        cy.wait(1000)

        cy.get('aside.App-sidebar ul > li > a')
            .contains('My Fulcrum')
            .click()

        cy.wait(1000)

        cy.get('#SlateEditor').should('not.have.attr', 'contenteditable')
        cy.get('body').type('{e}')

        cy.wait(100)
        cy.get('#SlateEditor').should('have.attr', 'contenteditable', 'true')

        cy.wait(100)
        cy.get('#SlateEditor').type('{ctrl}{enter}')
        cy.wait(100)
        cy.get('#SlateEditor').should('not.have.attr', 'contenteditable')

        cy.wait(100)
        cy.get('#LogoutButton').click()
    })
})
