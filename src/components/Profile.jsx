import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Instagram, Twitter, Linkedin, Youtube, Github, Facebook,
    Globe, Mail, MessageCircle, Gamepad2, Video, Music
} from 'lucide-react';
import { motion } from 'framer-motion';

// Icon mapping
const ICONS = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    github: Github,
    facebook: Facebook,
    website: Globe,
    tiktok: Video, // Fallback
    discord: Gamepad2, // Fallback
    whatsapp: MessageCircle,
    telegram: MessageCircle, // Fallback
    email: Mail,
    default: Globe
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
    website: '#2563EB',
};

export default function Profile() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            const encoded = searchParams.get('d');
            if (!encoded) {
                throw new Error('No data found');
            }

            const jsonString = decodeURIComponent(atob(encoded));
            const parsed = JSON.parse(jsonString);

            // Basic validation
            if (!parsed.n) throw new Error('Invalid data');

            setData({
                name: parsed.n,
                bio: parsed.b,
                links: parsed.l || []
            });
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-gray-400 mb-6">The link might be broken or expired.</p>
            <a href="/" className="primary-btn">Create Your Own</a>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
            >
                {/* Banner/Header */}
                <div className="h-32 bg-gradient-to-r from-violet-600 to-pink-500 relative">
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                        <div className="w-24 h-24 rounded-full bg-black p-1 shadow-xl">
                            <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white border-4 border-black">
                                {data.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-16 pb-8 px-6 text-center">
                    <h1 className="text-2xl font-bold mb-2 text-white">{data.name}</h1>
                    {data.bio && <p className="text-gray-400 text-sm mb-8 px-4">{data.bio}</p>}

                    <div className="space-y-3">
                        {data.links.map((link, i) => {
                            const Icon = ICONS[link.p] || ICONS.default;
                            const bg = COLORS[link.p] || '#ffffff22';
                            const isGradient = bg.includes('gradient');

                            return (
                                <motion.a
                                    key={i}
                                    href={link.u.startsWith('http') ? link.u : `https://${link.u}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center p-1 rounded-xl group hover:scale-[1.02] transition-transform duration-200"
                                    style={{
                                        background: isGradient ? bg : 'transparent',
                                        backgroundColor: !isGradient ? bg : undefined
                                    }}
                                >
                                    <div className="flex-1 flex items-center bg-[#1a1a1a] bg-opacity-90 rounded-lg p-3 backdrop-blur-sm group-hover:bg-opacity-80 transition-all border border-white/5">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4" style={{ background: isGradient ? bg : (bg === '#ffffff22' ? 'white' : bg), color: 'white' }}>
                                            <Icon size={20} color={'white'} fill={link.p === 'instagram' ? 'white' : 'currentColor'} />
                                        </div>
                                        <span className="font-medium text-white flex-1 text-left capitalize">
                                            {link.p.replace('_', ' ')}
                                        </span>
                                        <Globe size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                                    </div>
                                </motion.a>
                            );
                        })}
                    </div>

                    <div className="mt-12 pt-6 border-t border-white/10">
                        <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                            <Zap size={12} /> Created with LinkHub
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
