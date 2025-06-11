/// <reference types="cypress" />

describe('Login spec', () => {
  it('Login successfull', () => {

    // Le navigateur doit être sur la page (/login).
    cy.visit('/login')

    // Création d'un utilisateur fictif.
    const user = {
      id: 1,
      username: 'yoga@studio.com',
      firstName: 'Admin',
      lastName: 'Admin',
      admin: true,
    }

    // Interception de la requête POST vers le backend pour simuler la connexion réussi.
    cy.intercept('POST', '/api/auth/login', user).as('login')

    // Interception de la requête GET vers le backend pour simuler la récupération des sessions.
    cy.intercept('GET', '/api/session', []).as('session')

    // Remplissage du formulaire de connexion
    cy.get('input[formControlName=email]').type(user.username)
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    // Attendre que la requête de connexion soit interceptée et confirmée.
    cy.wait('@login');

    // Vérifier qu'on a bien été transférer vers la page d'accueil
    cy.url().should('include', '/sessions')

    // Attendre que la requête de récupération des sessions soit interceptée et confirmée.
    cy.wait('@session');

  })
});