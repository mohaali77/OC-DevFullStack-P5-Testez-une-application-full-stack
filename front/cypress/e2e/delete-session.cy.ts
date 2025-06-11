/// <reference types="cypress" />

describe('Delete Session spec', () => {
    it('should delete a session successfully', () => {

        // Le navigateur doit être sur la page (/login).
        cy.visit('/login')

        // Création d'un utilisateur.
        const user = {
            id: 1,
            username: 'yoga@studio.com',
            firstName: 'admin',
            lastName: 'admin',
            admin: true
        }

        // Création d'une session.
        let session = {
            id: 1,
            name: "Session 1",
            date: "2024-10-17T00:00:00.000+00:00",
            teacher_id: 1,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit!",
            users: [],
            createdAt: "2024-10-05T17:47:17",
            updatedAt: "2024-10-06T17:57:50"
        }


        // Création d'un professeur.
        const teacher = {
            id: 1,
            lastName: "DELAHAYE",
            firstName: "Margot",
            createdAt: "2024-09-30T10:55:24",
            updatedAt: "2024-09-30T10:55:24"
        }

        // Interception de la requête POST pour simuler la connexion réussi.
        cy.intercept('POST', 'api/auth/login', user);

        // Interception de la requête GET pour simuler la récupération des sessions.
        cy.intercept('GET', 'api/session', [session]).as('sessions')

        // Interception de la requête GET pour simuler la récupération de l'unique session.
        cy.intercept('GET', `api/session/${session.id}`, session).as('session')

        // Interception de la requête GET pour simuler la récupération du professeur.
        cy.intercept('GET', `api/teacher/${session.teacher_id}`, teacher).as('teacher')

        // Interception de la requête DELETE pour simuler la suppression d'une session.
        cy.intercept('DELETE', `api/session/${session.id}`, session).as('delete')

        // Remplissage du formulaire de connexion
        cy.get('input[formControlName=email]').type(user.username)
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        // Vérifier qu'on a bien été transférer vers la page /sessions
        cy.url().should('include', '/sessions')

        // Attendre que la requête de récupération des sessions soit interceptée et confirmée.
        cy.wait('@sessions');

        // On clique sur le bouton Detail 
        cy.contains('button', 'Detail').click();

        // Vérifier qu'on a bien été transférer vers la page '/detail'
        cy.url().should('include', 'detail');

        // Attendre que la requête de récupération du professeur soit interceptée et confirmée.
        cy.wait('@teacher');

        // Attendre que la requête de récupération de la session soit interceptée et confirmée.
        cy.wait('@session');

        // Interception de la requête GET vers le backend pour simuler la récupération du tableau VIDE des ssessions.
        cy.intercept('GET', 'api/session', []).as('sessions')

        // On clique sur le bouton Delete 
        cy.contains('button', 'Delete').click();

        // Vérifier qu'on a bien été transférer vers la page '/sessions'
        cy.url().should('include', '/sessions')

        // Attendre que la requête de suppression de la session soit interceptée et confirmée.
        cy.wait('@delete');

        // Attendre que la requête de récupération du NOUVEAU tableau de sessions soit interceptée et confirmée.
        cy.wait('@sessions');

    });
});



