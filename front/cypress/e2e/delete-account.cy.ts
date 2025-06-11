/// <reference types="cypress" />

describe('Delete spec', () => {
    it('should delete an account successfully', () => {

        // Le navigateur doit être sur la page (/login).
        cy.visit('/login')

        // Création d'un utilisateur fictif.
        const user = {
            id: 1,
            email: 'test@test.com',
            firstName: 'Test',
            lastName: 'Test',
            admin: false,
            createdAt: "2024-10-07T16:46:27",
            updatedAt: "2024-10-07T16:46:27"
        }

        // Interception de la requête POST vers le backend pour simuler la connexion réussi.
        cy.intercept('POST', '/api/auth/login', user).as('login')

        // Interception de la requête GET vers le backend pour simuler la récupération des sessions.
        cy.intercept('GET', '/api/session', []).as('session')

        // Interception de la requête GET vers le backend pour simuler la récupération des infos du user.
        cy.intercept('GET', `/api/user/${user.id}`, user).as('userInfos')

        // Interception de la requête DELETE vers le backend pour simuler la suppression du compte user.
        cy.intercept('DELETE', `/api/user/${user.id}`, user).as('delete')

        // Remplissage du formulaire de connexion
        cy.get('input[formControlName=email]').type(user.email)
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        // Attendre que la requête de connexion soit interceptée et confirmée.
        cy.wait('@login');

        // Vérifier qu'on a bien été transférer vers la page /sessions
        cy.url().should('include', '/sessions')

        // Attendre que la requête de récupération des sessions soit interceptée et confirmée.
        cy.wait('@session');

        // On clique sur le l'onglet "account"
        cy.get('span[routerLink="me"]').click();

        // Vérifier qu'on a bien été transférer vers la page /me
        cy.url().should('include', '/me')

        // Attendre que la requête de connexion soit interceptée et confirmée.
        cy.wait('@userInfos');

        // On clique sur le bouton de suppression
        cy.get('button[color="warn"]').click();

        // Attendre que la requête de suppression soit interceptée et confirmée.
        cy.wait('@delete');

        // Vérifier qu'on a bien été transférer vers la page '/'
        cy.url().should('include', '/')


    })
});