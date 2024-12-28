import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render , screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Products } from './Products';
import { setupStore } from '../../store';

vi.mock('axios');

function renderWithProviders(
  ui: React.ReactNode,
  {
    initialState,
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }: { children: React.ReactNode}) {
    return (
        <Provider store={setupStore({ preloadedState: initialState })}>
            <MemoryRouter>
                {children}
            </MemoryRouter>
        </Provider>
    );
  }
    return render(ui, { wrapper: props => <Wrapper {...props} />, ...renderOptions });
}
  
describe('Products', () => {

    it('Should show loading message when loading products', async () => {

        const mockProducts = [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
        ];

        // Mock Axios to return the mock products
        //vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockProducts });
        vi.mocked(axios.get).mockResolvedValue({ data: mockProducts });

        renderWithProviders(<Products />, {
            initialState: {
                products: []
            }
        });

        expect( await screen.getByText('Produkte werden geladen...')).toBeInTheDocument();

    });

    it('Should show products when products loaded', async () => {

        const mockProducts = [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
        ];

        // Mock Axios to return the mock products
        vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockProducts });

        renderWithProviders(<Products />, {
            initialState: {
                products: []
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

    });

    it('Should show error when products loading failed', async () => {

        // Mock Axios to return the mock products
        vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Produkte konnten nicht geladen werden'));

        renderWithProviders(<Products />, {
            initialState: {
                products: []
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Produkte konnten nicht geladen werden')).toBeInTheDocument();
        });

    });

})