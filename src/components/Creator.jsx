import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Trash2, Download, Zap, ExternalLink, ShieldCheck, Smartphone, MousePointer2, Copy, Check } from 'lucide-react';
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

    // Improved Encoding Logic
    useEffect(() => {
        try {
            const validLinks = profile.links.filter(l => l.url.trim() !== '');
            const data = {
                n: profile.name || 'Anonymous',
                b: profile.bio || '',
                l: validLinks.map(l => ({ p: l.platform, u: l.url }))
            };

            // Use a more robust encoding for characters like emojis
            const jsonString = JSON.stringify(data);
            const utf8SafeString = encodeURIComponent(jsonString);
            const encoded = btoa(utf8SafeString);

            const baseUrl = `${window.location.origin}/profile`;
            setGeneratedUrl(`${baseUrl}?d=${encoded}`);
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
            canvas.width = 1000; // High resolution
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
        <div className="max-w-[1400px] mx-auto px-4 py-8">
            {/* Header */}
            <header className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-purple-400 mb-4"
                >
                    <Zap size={14} fill="currentColor" /> QR QR Multi-Link Generator
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black mb-4">
                    Super <span className="gradient-text">QR Link.</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    One single QR code for all your social identities. No sign-up required.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">

                {/* Editor (Left) */}
                <div className="lg:col-span-7 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-[2.5rem] p-10 border border-white/10"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <MousePointer2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Design Your Hub</h2>
                                <p className="text-sm text-gray-500">Fill your details to update the QR live</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-400 ml-1">Profile Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name..."
                                    className="input-field py-4"
                                    value={profile.name}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-400 ml-1">One-line Bio</label>
                                <input
                                    type="text"
                                    placeholder="Tell the world about you..."
                                    className="input-field py-4"
                                    value={profile.bio}
                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-gray-400">Connect Accounts</label>
                                <button
                                    onClick={addLink}
                                    className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all flex items-center gap-2 text-xs font-bold"
                                    title="Add new link"
                                >
                                    <Plus size={16} /> Add Link
                                </button>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence>
                                    {profile.links.map((link) => (
                                        <motion.div
                                            key={link.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex gap-4 items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5"
                                        >
                                            <select
                                                className="bg-black border-none text-sm font-bold rounded-xl px-4 py-4 w-40 focus:ring-2 ring-purple-500 transition-all"
                                                value={link.platform}
                                                onChange={e => updateLink(link.id, 'platform', e.target.value)}
                                            >
                                                {PLATFORMS.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder={PLATFORMS.find(p => p.id === link.platform)?.placeholder}
                                                className="flex-1 bg-transparent border-none text-sm p-2 focus:ring-0 text-white placeholder:text-gray-600"
                                                value={link.url}
                                                onChange={e => updateLink(link.id, 'url', e.target.value)}
                                            />
                                            <button
                                                onClick={() => removeLink(link.id)}
                                                className="p-3 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all rounded-xl"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={addLink}
                                className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-3 text-sm font-extrabold text-gray-500 hover:text-purple-400"
                            >
                                <Plus size={20} /> Add Another Social Account
                            </button>
                        </div>
                    </motion.div>

                    <footer className="flex items-center gap-4 text-xs text-gray-500 px-4">
                        <ShieldCheck className="text-green-500" size={20} />
                        <p>Private & Secure: Data is stored inside the QR code itself. No database is used.</p>
                    </footer>
                </div>

                {/* Live Preview & QR (Right) */}
                <div className="lg:col-span-5 flex flex-col items-center gap-10">

                    {/* Master QR Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-[3rem] p-10 w-full flex flex-col items-center border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.1)]"
                    >
                        <div className="relative mb-10 group cursor-pointer" onClick={downloadQR}>
                            <div className="absolute -inset-6 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-[3rem] opacity-30 blur-2xl group-hover:opacity-50 transition-all duration-500" />
                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl transform transition-transform group-hover:scale-[1.02]">
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    value={generatedUrl || window.location.origin}
                                    size={240}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>
                        </div>

                        <div className="text-center w-full space-y-6">
                            <div>
                                <h3 className="text-2xl font-black mb-2 text-white italic tracking-tight">THE MASTER QR</h3>
                                <p className="text-gray-500 text-sm font-medium">Scan to open all links at once</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
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
                        </div>
                    </motion.div>

                    {/* Phone Preview Mockup */}
                    <div className="w-full max-w-[340px]">
                        <div className="text-center mb-4 flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Live Landing Page Preview</span>
                        </div>

                        <motion.div
                            className="relative w-full aspect-[9/18.5] bg-zinc-950 rounded-[3.5rem] border-[10px] border-zinc-900 shadow-2xl overflow-hidden"
                        >
                            {/* iPhone Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-zinc-900 rounded-b-3xl z-20" />

                            {/* Preview Content */}
                            <div className="absolute inset-0 overflow-y-auto pt-14 px-6 pb-10 space-y-8 no-scrollbar">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 mb-4 flex items-center justify-center text-3xl font-black shadow-lg">
                                        {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <h4 className="font-black text-lg text-white tracking-tight">{profile.name || 'Your Name'}</h4>
                                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium mt-1">{profile.bio || 'Your bio will appear here after typing'}</p>
                                </div>

                                <div className="space-y-3">
                                    {profile.links.filter(l => l.url).map((link, i) => (
                                        <div key={i} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-4 transition-all">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                                                <Smartphone size={16} className="text-gray-400" />
                                            </div>
                                            <span className="text-[11px] font-bold capitalize text-white opacity-80">{link.platform}</span>
                                        </div>
                                    ))}
                                    {profile.links.filter(l => l.url).length === 0 && (
                                        <div className="text-center py-8 opacity-20 border-2 border-dashed border-white/10 rounded-2xl">
                                            <p className="text-[10px] font-bold text-gray-400">Waiting for links...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
