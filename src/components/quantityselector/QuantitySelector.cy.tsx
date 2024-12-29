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