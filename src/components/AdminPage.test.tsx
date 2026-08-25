import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from './AdminPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firebaseDb from 'firebase/database';

vi.mock('../firebase', () => ({
    rtdb: {},
}));

vi.mock('firebase/database', async (importOriginal) => {
    const actual = await importOriginal<typeof firebaseDb>();
    return {
        ...actual,
        ref: vi.fn(),
        query: vi.fn(),
        orderByChild: vi.fn(),
        onValue: vi.fn(),
    };
});

describe('AdminPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loaded users in reverse (descending) order', async () => {
        const mockUsers = [
            { uid: '1', email: 'user1@test.com', username: 'User One', createdAt: 1000 },
            { uid: '2', email: 'user2@test.com', username: 'User Two', createdAt: 2000 },
            { uid: '3', email: 'user3@test.com', username: 'User Three', createdAt: 3000 },
        ];

        const mockChildSnapshots = mockUsers.map((u) => ({
            val: () => u,
        }));

        const mockSnapshot = {
            exists: () => true,
            size: mockChildSnapshots.length,
            forEach: (cb: (child: unknown) => void) => {
                mockChildSnapshots.forEach(cb);
            },
        };

        vi.mocked(firebaseDb.onValue).mockImplementation((_query: unknown, callback: unknown) => {
            (callback as (snapshot: typeof mockSnapshot) => void)(mockSnapshot);
            return () => {};
        });

        render(<AdminPage />);

        await waitFor(() => {
            expect(screen.getByText('3 Total Accounts')).toBeInTheDocument();
        });

        // The desktop table rows should list User Three first, then User Two, then User One
        const userElements = screen.getAllByText(/User (One|Two|Three)/);
        expect(userElements[0]).toHaveTextContent('User Three');
        expect(userElements[1]).toHaveTextContent('User Two');
        expect(userElements[2]).toHaveTextContent('User One');
    });

    it('handles empty snapshot correctly', async () => {
        const mockSnapshot = {
            exists: () => false,
            size: 0,
            forEach: () => {},
        };

        vi.mocked(firebaseDb.onValue).mockImplementation((_query: unknown, callback: unknown) => {
            (callback as (snapshot: typeof mockSnapshot) => void)(mockSnapshot);
            return () => {};
        });

        render(<AdminPage />);

        await waitFor(() => {
            expect(screen.getByText('0 Total Accounts')).toBeInTheDocument();
            expect(screen.getByText('No User Records Found')).toBeInTheDocument();
        });
    });
});
