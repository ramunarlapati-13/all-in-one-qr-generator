import { render } from '@testing-library/react';
import AdSenseScript from './AdSenseScript';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AdSenseScript', () => {
    beforeEach(() => {
        // Clear all scripts from document.head before each test
        document.head.innerHTML = '';
    });

    afterEach(() => {
        // Clean up after each test
        document.head.innerHTML = '';
    });

    it('should append the adsense script to the document head', () => {
        render(<AdSenseScript />);

        const src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4862759938728085";
        const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

        expect(script).toBeInTheDocument();
        expect(script.src).toBe(src);
        expect(script.async).toBe(true);
        expect(script.crossOrigin).toBe("anonymous");
    });

    it('should not append a duplicate script if one already exists', () => {
        const src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4862759938728085";

        // Add existing script
        const existingScript = document.createElement('script');
        existingScript.src = src;
        document.head.appendChild(existingScript);

        render(<AdSenseScript />);

        // Count how many scripts with this src exist
        const scripts = document.querySelectorAll(`script[src="${src}"]`);
        expect(scripts.length).toBe(1);
    });
});
