import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LZString from 'lz-string';
import BioPage from './components/BioPage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const PreviewPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const dataParam = searchParams.get('d');
    const idParam = searchParams.get('id');
    const [bioData, setBioData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (idParam) {
                    const docRef = doc(db, 'profiles', idParam);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setBioData(docSnap.data());
                    }
                } else if (dataParam) {
                    const decompressed = LZString.decompressFromEncodedURIComponent(dataParam);
                    if (decompressed) {
                        const parsed = JSON.parse(decompressed);

                        // Handle both legacy (full keys) and new minified data
                        if (parsed.n || parsed.r) {
                            setBioData({
                                name: parsed.n,
                                role: parsed.r,
                                avatarUrl: parsed.a,
                                qrColor: parsed.c,
                                links: Array.isArray(parsed.l) ? parsed.l.map((link: any) => ({
                                    label: link.l,
                                    url: link.u,
                                    icon: link.i
                                })) : []
                            });
                        } else {
                            setBioData(parsed);
                        }
                    }
                }
            } catch (e) {
                console.error('Failed to parse bio data', e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dataParam, idParam]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a050c] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#ce2bee]/30 border-t-[#ce2bee] rounded-full animate-spin" />
            </div>
        );
    }

    if (!bioData) {
        return (
            <div className="min-h-screen bg-[#0a050c] flex items-center justify-center p-6 text-center">
                <div className="max-w-md">
                    <h1 className="text-4xl font-black text-white mb-4">404</h1>
                    <p className="text-[#c092c9] mb-8">Profile not found or the link is invalid.</p>
                    <a href="/" className="bg-[#ce2bee] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#ce2bee]/20">
                        Create Your Own
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a050c] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ce2bee]/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#422348]/30 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-[400px] h-[100dvh] sm:h-[800px]">
                <BioPage
                    {...bioData}
                    qrValue={window.location.href}
                    qrColor={bioData.qrColor || bioData.c || '#ce2bee'}
                />
            </div>
        </div>
    );
};

export default PreviewPage;
