import React, { useEffect } from 'react';

const AdSenseScript: React.FC = () => {
    useEffect(() => {
        const src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4862759938728085";
        if (!document.querySelector(`script[src="${src}"]`)) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.crossOrigin = "anonymous";
            document.head.appendChild(script);
        }
    }, []);

    return null;
};

export default AdSenseScript;
