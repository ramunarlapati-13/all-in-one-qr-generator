import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import AdUnit from './AdUnit';
import React from 'react';

describe('AdUnit', () => {
    beforeEach(() => {
        // Reset window.adsbygoogle before each test
        delete (window as any).adsbygoogle;
    });

    it('renders without crashing and initializes adsbygoogle', () => {
        render(<AdUnit />);
        expect(window.adsbygoogle).toBeDefined();
        expect(window.adsbygoogle).toEqual([{}]);
    });

    it('catches and logs errors when pushing to adsbygoogle fails', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Mock adsbygoogle push to throw an error
        Object.defineProperty(window, 'adsbygoogle', {
            get: () => {
                return {
                    push: () => {
                        throw new Error('Test AdSense Error');
                    }
                };
            },
            configurable: true
        });

        render(<AdUnit />);

        expect(consoleErrorSpy).toHaveBeenCalledWith('AdSense error:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });
});
