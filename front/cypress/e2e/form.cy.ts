/// <reference types="cypress" />

describe('Create Session spec', () => {
    it('should login and navigate to create session', () => {

        // Le navigateur doit être sur la page (/login).
        cy.visit('/login')

        // Création d'un utilisateur fictif.
        const user = {
            id: 1,
            username: 'yoga@studio.com',
            firstName: 'admin',
            lastName: 'admin',
            admin: true
        }

        // Création d'un tableau de sessions fictives.
        let sessions = [
            {
                "id": 1,
                "name": "Session 1",
                "date": "2024-10-17T00:00:00.000+00:00",
                "teacher_id": 1,
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit!",
                "users": [],
                "createdAt": "2024-10-05T17:47:17",
                "updatedAt": "2024-10-06T17:57:50"
            },
            {
                "id": 2,
                "name": "Session 2",
                "date": "2024-10-08T00:00:00.000+00:00",
                "teacher_id": 2,
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit!",
                "users": [],
                "createdAt": "2024-10-06T18:47:10",
                "updatedAt": "2024-10-06T18:47:10"
            }
        ]

        // Création de deux professeurs.
        const teachers = [
            {
                id: 1,
                lastName: "DELAHAYE",
                firstName: "Margot",
                createdAt: "2023-08-29 18:57:01",
                updatedAt: "2023-08-29 18:57:01",
            },
            {
                id: 2,
                lastName: "THIERCELIN",
                firstName: "Hélène",
                createdAt: "2023-08-29 18:57:01",
                updatedAt: "2023-08-29 18:57:01",
            }
        ]

        // Création d'une nouvelle session fictive qui sera ajouté.
        const newSession = {
            id: sessions.length + 1,
            name: "Session 3",
            date: '2024-10-15',
            teacher_id: teachers[0].id,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit!",
            users: [],
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString()
        }

        // Interception de la requête POST vers le backend pour simuler la connexion réussi.
        cy.intercept('POST', '/api/auth/login', user);

        // Interception de la requête GET vers le backend pour simuler la récupération des sessions.
        cy.intercept('GET', '/api/session', sessions).as('session')

        // Interception de la requête GET vers le backend pour simuler la récupération des professeurs.
        cy.intercept('GET', '/api/teacher', teachers).as('teacher')

        // Interception de la requête POST vers le backend pour simuler la création de la nouvelle session.
        cy.intercept('POST', '/api/session', newSession).as('createSession');

        // Remplissage du formulaire de connexion
        cy.get('input[formControlName=email]').type(user.username)
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        // Vérifier qu'on a bien été transférer vers la page d'accueil
        cy.url().should('include', '/sessions')

        // Attendre que la requête de récupération des sessions soit interceptée et confirmée.
        cy.wait('@session');

        // On clique sur le bouton create 
        cy.get('button[routerLink="create"]').click();

        // Vérifier qu'on a bien été transférer vers la page '/create'
        cy.url().should('include', '/create');

        // Attendre que la requête de récupération des professeurs soit interceptée et confirmée.
        cy.wait('@teacher');

        // Remplissage du formulaire de création de session
        cy.get('input[formControlName=name]').type(newSession.name)

        cy.get('input[formControlName=date]').type(newSession.date);

        cy.get('mat-select[formControlName=teacher_id]').click();
        cy.get("mat-option").should('exist').and('be.visible');
        cy.get("mat-option").contains(teachers[0].firstName + ' ' + teachers[0].lastName).click();
        cy.get('textarea[formControlName=description]').type(newSession.description)

        // Création d'un nouveau tableau de sessions qui contiendra la nouvelle session créée
        const newListSession = [...sessions, newSession]

        // Interception de la requête GET vers le backend pour simuler la récupération du NOUVEAU tableau de sessions.
        cy.intercept('GET', '/api/session', newListSession).as('session');

        // On soumet le formulaire
        cy.get('button[type=submit]').click();

        // Attendre que la requête de la création de la session soit interceptée et confirmée.
        cy.wait('@createSession');

        // Attendre que la requête de récupération du NOUVEAU tableau de sessions soit interceptée et confirmée.
        cy.wait('@session');

    });
});



