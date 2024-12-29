/// <reference types="cypress" />
describe('e2e', () => {

    it ('Should show header when react app loaded', () => {
        cy.visit('/');
    });

    it('register user', () => {

        cy.intercept('POST', 'http://localhost:3001/register', (req) => {
            req.continue((res) => {
                // Überprüfen, ob der Status 201 ist
                console.log(res);
                expect(res.statusCode).to.equal(201);
            });
        }).as('postRequest');

        cy.visit('/');

        // Button "Registrieren" klicken
        cy.get('button#nav-register').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).click();
        });

        // Prüfen, ob die Registrierungseite geöffnet wurde
        cy.get('h1#title').should('exist');

        // Vorname
        cy.get('input#firstName').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).type('Max');
        });

        // Nachname
        cy.get('input#lastName').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).type('Mustermann');
        });

        // E-Mail
        cy.get('input#email').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).type('max@mustermann.com');
        });

        // Password
        cy.get('input#password').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).type('12345678');
        });

        // Register
        cy.get('button#register').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).click();
        });

        cy.wait('@postRequest');

    });

    it('login user', () => {

        cy.intercept('POST', 'http://localhost:3001/login', (req) => {
            req.continue((res) => {
                // Überprüfen, ob der Status 201 ist
                console.log(res);
                expect(res.statusCode).to.equal(200);
            });
        }).as('postRequest');

        cy.visit('/');

        // Button "Registrieren" klicken
        cy.get('button#nav-login').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).click();
        });

        // Prüfen, ob die Registrierungseite geöffnet wurde
        cy.get('h1#title').should('exist');

        // E-Mail
        cy.get('input#email').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).type('max@mustermann.com');
        });

        // Password
        cy.get('input#password').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).type('12345678');
        });

        // Register
        cy.get('button#login').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).click();
        });

        cy.wait('@postRequest');

        cy.url().should(
            'be.equal',
            `${Cypress.config("baseUrl")}/admin`
        );
    
    });

    it('show products and click badges', () => {

        cy.visit('/');

        // Menüpunkt "Products" klicken
        cy.get('a#nav-products').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).click();
        });

        cy.get('table#products').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).contains('td', 'Apfel');
        });


        // Badge "Getränk" anklicken
        cy.get('span.Getränk').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).click();
        });

        cy.get('table#products').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).contains('td', 'Kaffee');
        });


        // Badge "Getränk" anklicken
        cy.get('span.Obst').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).click();
        });

        cy.get('table#products').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).contains('td', 'Banane');
        });


        // Badge "Getränk" anklicken
        cy.get('span.Süßigkeit').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).click();
        });

        cy.get('table#products').then(item => {
            cy.wrap(item).should('exist');
            cy.wrap(item).contains('td', 'Schokoriegel');
        });
        
    });

});