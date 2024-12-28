- [9. Cypress](#9-cypress)
  - [9.1 Installieren & konfigurieren Sie Cypress](#91-installieren--konfigurieren-sie-cypress)
  - [9.2 Erstellen Sie ein Komponenten Test für die Komponente "QuantitySelector"](#92-erstellen-sie-ein-komponenten-test-für-die-komponente-quantityselector)
  - [9.3 Erstellen Sie ein Komponenten Test für die Komponente "Poducts"](#93-erstellen-sie-ein-komponenten-test-für-die-komponente-poducts)
  - [9.4 Erstellen Sie einen End-to-End-Test (E2E-Test) für das Schulungsprojekt](#94-erstellen-sie-einen-end-to-end-test-e2e-test-für-das-schulungsprojekt)

The solution branch for the whole lab is `solution-9-cypress`

# 9. Cypress

## 9.1 Installieren & konfigurieren Sie Cypress

Installen Sie im ersten Schritt Cypress mit dem Befehl `npm install --save-dev cypress`, falls es noch nicht installiert wurde

Erweitern Sie die `cypress.config.ts` um die URL zu dem Schulungsprojekt

<details>
<summary>Show solution</summary>
<p>

**/cypress.config.ts**

```typescript
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173'
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
```

</p>
</details>

## 9.2 Erstellen Sie ein Komponenten Test für die Komponente "QuantitySelector"

Erstellen Sie für folgende Schritte je einen Test in der Testsuite `QuantitySelector`

- mount quantityselector
- add product to cart
- increase quantity
- decrease quantity
- remove product from cart

<details>
<summary>Show solution</summary>
<p>

**/src/components/quantityselector/QuantitySelector.cy.tsx**

```typescript
/// <reference types="cypress" />
import { QuantitySelector } from "./QuantitySelector"
import { Provider } from "react-redux"
import { setupStore } from '../../store';
import './../../index.css';

describe('QuantitySelector', () => {

    it('mount quantityselector', () => {

        const preloadedState = {
            auth: {
                loading: false,
                userInfo: null,
                accessToken: null,
                error: null,
                success: false,
            },
            cart: {
                cartItems: [],
            },
            products: {
                loading: false,
                products: [],
                error: ''
            }
        };

        const mockProduct = {
            id: 1,
            name: 'Mock Drink',
            type: 'Getränk',
            description: '',
            price: 1.5
        };

        cy.mount(
            <Provider store={setupStore(preloadedState)}>
                <QuantitySelector product={mockProduct} />
            </Provider>
        );

        cy.get('button.addtocart').should('exist');

    });

    it('add product to cart', () => {

        const preloadedState = {
            auth: {
                loading: false,
                userInfo: null,
                accessToken: null,
                error: null,
                success: false,
            },
            cart: {
                cartItems: [],
            },
            products: {
                loading: false,
                products: [],
                error: ''
            }
        };

        const mockProduct = {
            id: 1,
            name: 'Mock Drink',
            type: 'Getränk',
            description: '',
            price: 1.5
        };

        cy.mount(
            <Provider store={setupStore(preloadedState)}>
                <QuantitySelector product={mockProduct} />
            </Provider>
        );

        const addToCart = cy.get('button.addtocart');
        addToCart.then(e => {
            cy.wrap(e).should('exist');
            cy.wrap(e).click();
        });

        const quantity = cy.get('input.quantity');
        quantity.then(e => {
            cy.wrap(e).should('exist');
            cy.wrap(e).should('have.value', '1');
        });

    });

    it('increase quantity', () => {

        const preloadedState = {
            auth: {
                loading: false,
                userInfo: null,
                accessToken: null,
                error: null,
                success: false,
            },
            cart: {
                cartItems: [],
            },
            products: {
                loading: false,
                products: [],
                error: ''
            }
        };

        const mockProduct = {
            id: 1,
            name: 'Mock Drink',
            type: 'Getränk',
            description: '',
            price: 1.5
        };

        cy.mount(
            <Provider store={setupStore(preloadedState)}>
                <QuantitySelector product={mockProduct} />
            </Provider>
        );

        cy.get('button.addtocart').click();
        
        cy.get('button.increase').click();

        const quantity = cy.get('input.quantity');
        quantity.then(e => {
            cy.wrap(e).should('exist');
            cy.wrap(e).should('have.value', '2');
        });

    });

    it('decrease quantity', () => {

        const mockProduct = {
            id: 1,
            name: 'Mock Drink',
            type: 'Getränk',
            description: '',
            price: 1.5
        };

        const preloadedState = {
            auth: {
                loading: false,
                userInfo: null,
                accessToken: null,
                error: null,
                success: false,
            },
            cart: {
                cartItems: [{
                    product: mockProduct,
                    quantity: 2
                }],
            },
            products: {
                loading: false,
                products: [],
                error: ''
            }
        };

        cy.mount(
            <Provider store={setupStore(preloadedState)}>
                <QuantitySelector product={mockProduct} />
            </Provider>
        );

        let quantity = cy.get('input.quantity');
        quantity.then(e => {
            cy.wrap(e).should('exist');
            cy.wrap(e).should('have.value', '2');
        });

        cy.get('button.decrease').click();

        quantity = cy.get('input.quantity');
        quantity.then(e => {
            cy.wrap(e).should('exist');
            cy.wrap(e).should('have.value', '1');
        });

    });

    it('remove product from cart', () => {

        const mockProduct = {
            id: 1,
            name: 'Mock Drink',
            type: 'Getränk',
            description: '',
            price: 1.5
        };

        const preloadedState = {
            auth: {
                loading: false,
                userInfo: null,
                accessToken: null,
                error: null,
                success: false,
            },
            cart: {
                cartItems: [{
                    product: mockProduct,
                    quantity: 1
                }],
            },
            products: {
                loading: false,
                products: [],
                error: ''
            }
        };

        cy.mount(
            <Provider store={setupStore(preloadedState)}>
                <QuantitySelector product={mockProduct} />
            </Provider>
        );

        let quantity = cy.get('input.quantity');
        quantity.then(e => {
            cy.wrap(e).should('exist');
            cy.wrap(e).should('have.value', '1');
        });

        cy.get('button.decrease').click();

        const addToCart = cy.get('button.addtocart');
        addToCart.then(e => {
            cy.wrap(e).should('exist');
        });

    });

});
```

</p>
</details>

## 9.3 Erstellen Sie ein Komponenten Test für die Komponente "Poducts"

Die Komponente `Products.tsx` nutzt zum Laden der Produkte den Redux Store und axios für den API-Zugriff. Beim Komponenten Test darf nicht auf produktive API-Endpunkte zugegriffen werden. Mocken Sie hierzu den API-Endpunkt `http://localhost:3001/products`. Cypress stellt hierzu die Methode `cy.intercept` zur Verfügung.

Erstellen Sie hierzu für folgende 3 Zustände je einen Test

- products loading
- products loaded successfully
- error loading products

<details>
<summary>Show solution</summary>
<p>

**/src/pages/products/Products.cy.tsx**

```typescript
/// <reference types="cypress" />
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom";
import { setupStore } from '../../store';
import { Products } from "./Products";
import './../../index.css';

describe('Products', () => {

    it ('products loading', () => {

        const preloadedState = {
            auth: {
                loading: false,
                userInfo: null,
                accessToken: null,
                error: null,
                success: false,
            },
            cart: {
                cartItems: [],
            },
            products: {
                loading: false,
                products: [],
                error: ''
            }
        };

        cy.intercept(
            'GET',
            'http://localhost:3001/products',
            {
                statusCode: 200,
                body: [
                    { id: 1, name: 'Mock Drink', type: 'Getränk', description: '', price: 1.5 }
                ]
            }
        ).as('mockedProducts');

        cy.mount(
            <Provider store={setupStore(preloadedState)}>
                <BrowserRouter>
                    <Products />
                </BrowserRouter>
            </Provider>
        );

        cy.get('div#loading-message').should('exist');

    });

    it ('products loaded successfully', () => {

        const preloadedState = {
            auth: {
                loading: false,
                userInfo: null,
                accessToken: null,
                error: null,
                success: false,
            },
            cart: {
                cartItems: [],
            },
            products: {
                loading: false,
                products: [],
                error: ''
            }
        };

        cy.intercept(
            'GET',
            'http://localhost:3001/products',
            {
                statusCode: 200,
                body: [
                    { id: 1, name: 'Mock Drink', type: 'Getränk', description: '', price: 1.5 }
                ]
            }
        ).as('getProducts');

        cy.mount(
            <Provider store={setupStore(preloadedState)}>
                <BrowserRouter>
                    <Products />
                </BrowserRouter>
            </Provider>
        );

        cy.wait('@getProducts').then(() => {
            
            const productName = cy.get('td.product-name');
            productName.then(element => {
                cy.wrap(element).should('exist');
                cy.wrap(element).should('have.text', 'Mock Drink');
            });
        });

    });

    it ('error loading products', () => {

        const preloadedState = {
            auth: {
                loading: false,
                userInfo: null,
                accessToken: null,
                error: null,
                success: false,
            },
            cart: {
                cartItems: [],
            },
            products: {
                loading: false,
                products: [],
                error: ''
            }
        };

        cy.intercept(
            'GET',
            'http://localhost:3001/products',
            {
                statusCode: 404,
                body: {}
            }
        ).as('mockedErrorProducts');

        cy.mount(
            <Provider store={setupStore(preloadedState)}>
                <BrowserRouter>
                    <Products />
                </BrowserRouter>
            </Provider>
        );

        cy.get('div#error-message').should('exist');

    });

});
```

</p>
</details>

## 9.4 Erstellen Sie einen End-to-End-Test (E2E-Test) für das Schulungsprojekt

Erstellen Sie für folgende Schritte je einen Test in der Testsuite `e2e`

- load webapp
- register user
- login user
  
  Prüfen Sie nach der Anmeldung auch, ob die Weiterleitung auf "/admin" korrekt durchgeführt wird

> **Hinweis**
>
> Wenn der submit-Button von den Tests geklickt wurde, geht Cypress zum nächsten Test obwohl im Hintergrund der API-Aufruf noch nicht abgeschlossen ist. Hierzu kann man `cy.intercept` zu Hilfe nehmen um auf den Abschluss des API-Aufrufs zu warten
>
>```typescript
>cy.intercept('POST', 'http://localhost:3001/register', (req) => {
>   req.continue((res) => {
>       // Überprüfen, ob der Status 201 ist
>       expect(res.statusCode).to.equal(201);
>   });
>}).as('postRequest');
>
>/* ...*/
>
>// Warten bis der API-Aufruf erfolgreich war
>cy.wait('@postRequest');
>
>```

<details>
<summary>Show solution</summary>
<p>

**/cypress/e2e/e2e.cy.ts**

```typescript
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
```

</p>
</details
