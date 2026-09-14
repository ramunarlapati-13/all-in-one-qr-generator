import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AdUnit from './AdUnit';

describe('AdUnit', () => {
    const originalAdsByGoogle = window.adsbygoogle;

    beforeEach(() => {
        delete (window as unknown as Record<string, unknown>).adsbygoogle;
    });

    afterEach(() => {
        window.adsbygoogle = originalAdsByGoogle;
        vi.restoreAllMocks();
    });

    it('renders the adsbygoogle ins element with correct attributes', () => {
        const { container } = render(<AdUnit />);
        const insElement = container.querySelector('ins.adsbygoogle');

        expect(insElement).toBeInTheDocument();
        expect(insElement).toHaveAttribute('data-ad-client', 'ca-pub-4862759938728085');
        expect(insElement).toHaveAttribute('data-ad-slot', '2148764840');
        expect(insElement).toHaveAttribute('data-ad-format', 'auto');
        expect(insElement).toHaveAttribute('data-full-width-responsive', 'true');
    });

    it('initializes window.adsbygoogle array and pushes an empty object on mount', () => {
        expect(window.adsbygoogle).toBeUndefined();

        render(<AdUnit />);

        expect(Array.isArray(window.adsbygoogle)).toBe(true);
        expect(window.adsbygoogle).toHaveLength(1);
        expect(window.adsbygoogle[0]).toEqual({});
    });

    it('pushes an empty object to existing window.adsbygoogle array on mount', () => {
        window.adsbygoogle = [{ existing: 'config' }];

        render(<AdUnit />);

        expect(window.adsbygoogle).toHaveLength(2);
        expect(window.adsbygoogle[1]).toEqual({});
    });

    it('logs an error when window.adsbygoogle.push throws an error', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const testError = new Error('Push failed');

        window.adsbygoogle = {
            push: vi.fn().mockImplementation(() => {
                throw testError;
            }),
        } as unknown as unknown[];

        render(<AdUnit />);

        expect(consoleSpy).toHaveBeenCalledWith('AdSense error:', testError);
    });
});
