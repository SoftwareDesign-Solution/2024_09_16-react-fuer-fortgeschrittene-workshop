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