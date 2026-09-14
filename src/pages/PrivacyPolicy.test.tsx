import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('PrivacyPolicy Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.head.innerHTML = '';
    });

    it('renders main heading and key sections', () => {
        render(
            <MemoryRouter>
                <PrivacyPolicy />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeInTheDocument();
        expect(screen.getByText(/last updated: february 2026/i)).toBeInTheDocument();

        expect(screen.getByRole('heading', { level: 2, name: /1\. introduction/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: /2\. information collection/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: /3\. use of information/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: /4\. third-party services/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: /5\. contact us/i })).toBeInTheDocument();
    });

    it('renders AdSenseScript and AdUnit components', () => {
        render(
            <MemoryRouter>
                <PrivacyPolicy />
            </MemoryRouter>
        );

        const adsenseSrc = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4862759938728085";
        const script = document.querySelector(`script[src="${adsenseSrc}"]`);
        expect(script).toBeInTheDocument();

        const adInsTag = document.querySelector('ins.adsbygoogle');
        expect(adInsTag).toBeInTheDocument();
    });

    it('navigates to home page when "Back to Home" button is clicked', () => {
        render(
            <MemoryRouter>
                <PrivacyPolicy />
            </MemoryRouter>
        );

        const backButtons = screen.getAllByRole('button', { name: /back to home/i });
        expect(backButtons.length).toBeGreaterThan(0);
        fireEvent.click(backButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
