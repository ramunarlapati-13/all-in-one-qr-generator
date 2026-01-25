import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Instagram, Twitter, Linkedin, Youtube, Github, Facebook,
    Globe, Mail, MessageCircle, Gamepad2, Video, ExternalLink, Zap, AlertCircle,
    Copy, Check, Share2, X, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ICONS = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    github: Github,
    facebook: Facebook,
    website: Globe,
    tiktok: Video,
    discord: Gamepad2,
    whatsapp: MessageCircle,
    telegram: MessageCircle,
    email: Mail,
};

const COLORS = {
    instagram: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    twitter: '#000000',
    linkedin: '#0077b5',
    youtube: '#FF0000',
    github: '#333333',
    facebook: '#1877F2',
    discord: '#5865F2',
    tiktok: '#000000',
    whatsapp: '#25D366',
    telegram: '#0088cc',
    website: '#6366f1',
};

export default function Profile() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    useEffect(() => {
        const loadProfile = () => {
            try {
                const encoded = searchParams.get('d');
                if (!encoded) throw new Error('No data');

                const decoded = decodeURIComponent(atob(encoded));
                const parsed = JSON.parse(decoded);

                if (!parsed.n) throw new Error('Invalid format');

                setData({
                    name: parsed.n,
                    bio: parsed.b,
                    links: parsed.l || []
                });
            } catch (err) {
                console.error("Failed to load profile:", err);
                setError(true);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        loadProfile();
    }, [searchParams]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${data.name}'s Links`,
                    text: `Check out ${data.name}'s social profiles!`,
                    url: window.location.href,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            setShowShareModal(true);
        }
    };

    const shareVia = {
        whatsapp: () => {
            const text = encodeURIComponent(`Check out ${data.name}'s profile: ${window.location.href}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        },
        facebook: () => {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        },
        twitter: () => {
            const text = encodeURIComponent(`Check out ${data.name}'s profile!`);
            const url = encodeURIComponent(window.location.href);
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        },
        linkedin: () => {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        },
        telegram: () => {
            const text = encodeURIComponent(`Check out ${data.name}'s profile!`);
            const url = encodeURIComponent(window.location.href);
            window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
        },
        email: () => {
            const subject = encodeURIComponent(`Check out ${data.name}'s profile`);
            const body = encodeURIComponent(`I thought you might be interested in ${data.name}'s profile:\n\n${window.location.href}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030014]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 text-center bg-[#030014]">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-3xl font-black mb-2">Oops! Profile Not Found</h2>
                <p className="text-gray-400 mb-8 max-w-xs">The QR code might be outdated or the link is incomplete.</p>
                <Link to="/" className="primary-btn px-8">Create Your Own QR</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4 relative">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative"
            >
                {/* Profile Header */}
                <div className="relative h-40 bg-gradient-to-br from-purple-900 to-indigo-950">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                        <div className="p-1.5 bg-[#030014] rounded-full">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                                {data.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="pt-16 pb-10 px-8 text-center">
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">{data.name}</h1>
                    {data.bio && <p className="text-gray-400 font-medium text-sm px-4 mb-10 leading-relaxed italic">"{data.bio}"</p>}

                    <div className="space-y-4 mb-8">
                        <AnimatePresence>
                            {data.links.map((link, i) => {
                                const Icon = ICONS[link.p] || Globe;
                                const linkColor = COLORS[link.p] || '#333';
                                const finalUrl = link.u.startsWith('http') ? link.u : `https://${link.u}`;

                                return (
                                    <motion.a
                                        key={i}
                                        href={finalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center p-1 rounded-2xl group hover:scale-[1.03] active:scale-95 transition-all duration-300"
                                        style={{ background: linkColor.includes('gradient') ? linkColor : 'rgba(255,255,255,0.03)' }}
                                    >
                                        <div className="flex-1 flex items-center bg-[#0a0a0f] bg-opacity-95 rounded-xl p-4 backdrop-blur-md group-hover:bg-opacity-80 transition-all border border-white/5">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 shadow-lg text-white"
                                                style={{ background: linkColor }}
                                            >
                                                <Icon size={20} />
                                            </div>
                                            <span className="font-bold text-white flex-1 text-left capitalize tracking-tight">
                                                {link.p}
                                            </span>
                                            <ExternalLink size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                                        </div>
                                    </motion.a>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all text-sm"
                        >
                            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button
                            onClick={handleNativeShare}
                            className="flex items-center justify-center gap-2 px-6 py-4 primary-btn rounded-2xl text-sm"
                        >
                            <Share2 size={18} />
                            Share
                        </button>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-600 uppercase">
                            <Zap size={10} fill="currentColor" className="text-purple-500" /> Powered by LinkHub
                        </div>
                        <Link to="/" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-4 py-2 rounded-full">
                            Create Your Own Profile
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-card rounded-3xl p-8 max-w-md w-full border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-white">Share Profile</h3>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { name: 'WhatsApp', icon: MessageCircle, color: '#25D366', action: shareVia.whatsapp },
                                    { name: 'Facebook', icon: Facebook, color: '#1877F2', action: shareVia.facebook },
                                    { name: 'Twitter', icon: Twitter, color: '#000000', action: shareVia.twitter },
                                    { name: 'LinkedIn', icon: Linkedin, color: '#0077b5', action: shareVia.linkedin },
                                    { name: 'Telegram', icon: Send, color: '#0088cc', action: shareVia.telegram },
                                    { name: 'Email', icon: Mail, color: '#6b7280', action: shareVia.email },
                                ].map((platform) => (
                                    <button
                                        key={platform.name}
                                        onClick={platform.action}
                                        className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                                            style={{ backgroundColor: platform.color }}
                                        >
                                            <platform.icon size={24} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{platform.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
