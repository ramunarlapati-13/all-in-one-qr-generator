import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Star, Heart, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a050c] text-white selection:bg-[#ce2bee]/30 pb-20">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ce2bee]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#422348]/20 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 sm:py-20">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-[#c092c9] hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-xs">Back to Home</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-12"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#ce2bee] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ce2bee]/20">
                            <Users className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-[#c092c9] bg-clip-text text-transparent">
                                About AIO REXPO QR
                            </h1>
                            <p className="text-[#ce2bee] font-black uppercase tracking-[0.2em] text-xs mt-2">Driven by Excellence</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-[#c092c9] leading-relaxed">
                        <section className="bg-[#1f1122]/30 border border-white/5 p-8 rounded-[32px] hover:border-[#ce2bee]/30 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <Star className="text-[#ce2bee]" size={24} /> Our Mission
                            </h2>
                            <p>
                                Welcome to AIO REXPO QR, a product of Rexplore Technologies. Our mission is to democratize digital accessibility by providing powerful, professional-grade tools for free. We believe that everyone—from solo creators to large enterprises—should have access to high-quality QR code generation and branding tools without the burden of expensive subscriptions.
                            </p>
                        </section>

                        <section className="bg-[#1f1122]/30 border border-white/5 p-8 rounded-[32px] hover:border-[#ce2bee]/30 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <Heart className="text-[#ce2bee]" size={24} /> Why Choose Us?
                            </h2>
                            <p>
                                Unlike many "free" generators that limit your features, hide downloads behind paywalls, or expire your QR codes, AIO REXPO QR is built on a philosophy of transparency and utility. Our QR codes are static (meaning they never expire) and fully customizable. Our Link in Bio solution is designed to be sleek, fast, and highly effective for modern social media needs.
                            </p>
                        </section>

                        <section className="bg-[#1f1122]/30 border border-white/5 p-8 rounded-[32px] hover:border-[#ce2bee]/30 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <Coffee className="text-[#ce2bee]" size={24} /> The Developer
                            </h2>
                            <p>
                                This project is maintained by Rexplorer, a passionate developer committed to building useful tools for the community. Every line of code is written with performance, privacy, and user experience in mind. We are constantly evolving and adding new features based on user feedback.
                            </p>
                        </section>
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">
                            Built with passion by Rexplore Technologies
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
