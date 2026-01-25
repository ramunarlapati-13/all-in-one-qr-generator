import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Trash2, Download, Zap, MousePointer2, Copy, Check, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORMS = [
    { id: 'instagram', name: 'Instagram', color: '#E1306C', placeholder: 'instagram.com/username' },
    { id: 'twitter', name: 'X / Twitter', color: '#000000', placeholder: 'x.com/username' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0077B5', placeholder: 'linkedin.com/in/username' },
    { id: 'youtube', name: 'YouTube', color: '#FF0000', placeholder: 'youtube.com/@channel' },
    { id: 'github', name: 'GitHub', color: '#333', placeholder: 'github.com/username' },
    { id: 'tiktok', name: 'TikTok', color: '#000000', placeholder: 'tiktok.com/@username' },
    { id: 'facebook', name: 'Facebook', color: '#1877F2', placeholder: 'facebook.com/username' },
    { id: 'website', name: 'Website', color: '#2563EB', placeholder: 'https://yourwebsite.com' },
];

export default function Creator() {
    const [profile, setProfile] = useState({
        name: '',
        bio: '',
        links: [
            { platform: 'instagram', url: '', id: 1 }
        ]
    });
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [copied, setCopied] = useState(false);

    const addLink = () => {
        setProfile(prev => ({
            ...prev,
            links: [...prev.links, { platform: 'website', url: '', id: Date.now() }]
        }));
    };

    const removeLink = (id) => {
        setProfile(prev => ({
            ...prev,
            links: prev.links.filter(l => l.id !== id)
        }));
    };

    const updateLink = (id, field, value) => {
        setProfile(prev => ({
            ...prev,
            links: prev.links.map(l => l.id === id ? { ...l, [field]: value } : l)
        }));
    };

    // Auto-generate URL whenever profile changes
    useEffect(() => {
        try {
            const validLinks = profile.links.filter(l => l.url.trim() !== '');
            const data = {
                n: profile.name || 'Anonymous',
                b: profile.bio || '',
                l: validLinks.map(l => ({ p: l.platform, u: l.url }))
            };

            const jsonString = JSON.stringify(data);
            const utf8SafeString = encodeURIComponent(jsonString);
            const encoded = btoa(utf8SafeString);

            // Use window.location.origin but treat it as a side effect or ensure it's available
            const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/profile` : '';
            if (baseUrl) {
                setGeneratedUrl(`${baseUrl}?d=${encoded}`);
            }
        } catch (e) {
            console.error("QR Generation Error:", e);
        }
    }, [profile]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadQR = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = 1000;
            canvas.height = 1000;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 100, 100, 800, 800);

            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${profile.name || 'linkhub'}-qr.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <header className="text-center mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold uppercase tracking-widest text-purple-400 mb-4"
                >
                    <Zap size={12} fill="currentColor" /> All-in-One Multi-Link QR
                </motion.div>
                <h1 className="text-4xl md:text-7xl font-black mb-4 leading-tight">
                    One QR. <span className="gradient-text">All Your Links.</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-4">
                    Create a single scannable QR code for all your social identities. No sign-up required.
                </p>
            </header>

            {/* Main Content - Centered */}
            <div className="space-y-8 max-w-2xl mx-auto">

                {/* Profile Editor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10"
                >
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-8 md:mb-10 justify-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                            <MousePointer2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">Design Your Hub</h2>
                            <p className="text-xs md:text-sm text-gray-500">Fill your details to update the QR live</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-xs md:text-sm font-bold text-gray-400 ml-1 block text-center md:text-left">Profile Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name..."
                                className="input-field py-3 md:py-4 text-center md:text-left"
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-xs md:text-sm font-bold text-gray-400 ml-1 block text-center md:text-left">One-line Bio</label>
                            <input
                                type="text"
                                placeholder="Tell the world about you..."
                                className="input-field py-3 md:py-4 text-center md:text-left"
                                value={profile.bio}
                                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs md:text-sm font-bold text-gray-400">Connect Accounts</label>
                            <button
                                onClick={addLink}
                                className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all flex items-center gap-2 text-[10px] md:text-xs font-bold"
                                title="Add new link"
                            >
                                <Plus size={14} /> Add Link
                            </button>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <AnimatePresence>
                                {profile.links.map((link) => (
                                    <motion.div
                                        key={link.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white/[0.03] p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5"
                                    >
                                        <select
                                            className="bg-black border-none text-sm font-bold rounded-lg md:rounded-xl px-3 py-3 w-full sm:w-40 focus:ring-2 ring-purple-500 transition-all"
                                            value={link.platform}
                                            onChange={e => updateLink(link.id, 'platform', e.target.value)}
                                        >
                                            {PLATFORMS.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 flex-1">
                                            <input
                                                type="text"
                                                placeholder={PLATFORMS.find(p => p.id === link.platform)?.placeholder}
                                                className="flex-1 bg-transparent border-none text-sm p-2 focus:ring-0 text-white placeholder:text-gray-600 min-w-0"
                                                value={link.url}
                                                onChange={e => updateLink(link.id, 'url', e.target.value)}
                                            />
                                            <button
                                                onClick={() => removeLink(link.id)}
                                                className="p-2 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all rounded-lg shrink-0"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={addLink}
                            className="w-full py-4 md:py-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-3 text-sm font-extrabold text-gray-500 hover:text-purple-400"
                        >
                            <Plus size={18} /> <span className="hidden sm:inline">Add Another Social Account</span><span className="sm:hidden">Add Account</span>
                        </button>
                    </div>
                </motion.div>

                {/* QR Code Section - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-[3rem] p-10 border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.1)]"
                >
                    <div className="flex flex-col items-center">
                        <div className="relative mb-10 group cursor-pointer" onClick={downloadQR}>
                            <div className="absolute -inset-6 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-[3rem] opacity-30 blur-2xl group-hover:opacity-50 transition-all duration-500" />
                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl transform transition-transform group-hover:scale-[1.02]">
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    value={generatedUrl || window.location.origin}
                                    size={240}
                                    level="M"
                                    includeMargin={true}
                                />
                            </div>
                        </div>

                        <div className="text-center w-full space-y-6">
                            <div>
                                <h3 className="text-2xl font-black mb-2 text-white italic tracking-tight">YOUR MASTER QR</h3>
                                <p className="text-gray-500 text-sm font-medium">Scan to open all links at once</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto">
                                <button
                                    onClick={downloadQR}
                                    className="primary-btn py-4 rounded-2xl flex items-center justify-center gap-2 text-sm"
                                >
                                    <Download size={20} /> Download QR
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-4 font-bold transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                                    {copied ? 'Copied Link' : 'Copy Link'}
                                </button>
                            </div>

                            {generatedUrl && (
                                <a
                                    href={generatedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-6 py-3 rounded-full"
                                >
                                    <ExternalLink size={16} /> Preview Profile
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Security Note - Centered */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-center gap-4 text-sm text-gray-400 max-w-xl mx-auto">
                    <ShieldCheck className="text-green-500 flex-shrink-0" size={24} />
                    <p className="text-center">Your data is securely encoded directly into the QR code. We don't store your personal information on our servers.</p>
                </div>
            </div>
        </div>
    );
}
