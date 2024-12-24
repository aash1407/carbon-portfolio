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

});