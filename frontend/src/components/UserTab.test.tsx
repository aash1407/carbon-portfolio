import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserTab from './UserTab';
import { getPortfolioQuote } from '../api/projectsApi';
import { vi, MockedFunction } from 'vitest';

vi.mock('../api/projectsApi');

const mockGetPortfolioQuote = getPortfolioQuote as MockedFunction<typeof getPortfolioQuote>;

describe('UserTab Component', () => {
    beforeEach(() => {
        mockGetPortfolioQuote.mockReset();
    });

    test('renders UserTab component', () => {
        render(<UserTab />);
        expect(screen.getByText('Generate Portfolio')).toBeInTheDocument();
    });

    test('handles input change', () => {
        render(<UserTab />);
        const input = screen.getByLabelText('Tons') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '1000' } });
        expect(input.value).toBe('1000');
    });

    test('shows alert for invalid input', () => {
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        render(<UserTab />);
        const button = screen.getByText('Generate Portfolio');
        fireEvent.click(button);
        expect(window.alert).toHaveBeenCalledWith('Please enter a valid number of tons');
    });

 
    test('displays error message on API failure', async () => {
        mockGetPortfolioQuote.mockRejectedValue(new Error('API Error'));

        vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<UserTab />);
        const input = screen.getByLabelText('Tons') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '1000' } });
        const button = screen.getByText('Generate Portfolio');
        fireEvent.click(button);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Error fetching portfolio quote');
        });
    });

});