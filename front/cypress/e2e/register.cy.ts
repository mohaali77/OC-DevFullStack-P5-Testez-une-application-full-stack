/// <reference types="cypress" />

describe('Register spec', () => {
    it('Register successfull', () => {

        // Le navigateur doit être sur la page (/register).
        cy.visit('/register')

        // Création d'un utilisateur fictif.
        const user = {
            id: 1,
            username: 'test@test.com',
            firstName: 'firstName',
            lastName: 'lastName',
            admin: false,
        }

        // Interception de la requête POST vers le backend pour simuler l'enregistrement réussi.
        cy.intercept('POST', '/api/auth/register', user).as('register')

        // Remplissage du formulaire d'inscription
        cy.get('input[formControlName=firstName]').type(user.firstName)
        cy.get('input[formControlName=lastName]').type(user.lastName)
        cy.get('input[formControlName=email]').type(user.username)
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        // Attendre que la requête d'inscription soit interceptée et confirmée.
        cy.wait('@register');

        // Vérifier qu'on a bien été transférer vers la page login
        cy.url().should('include', '/login');

    })
});