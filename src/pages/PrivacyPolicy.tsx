import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdSenseScript from '../components/AdSenseScript';
import AdUnit from '../components/AdUnit';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a050c] text-white selection:bg-[#ce2bee]/30 pb-20">
            <AdSenseScript />
            <AdUnit />
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
                            <Shield className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-[#c092c9] bg-clip-text text-transparent">
                                Privacy Policy
                            </h1>
                            <p className="text-[#c092c9] font-medium uppercase tracking-widest text-sm mt-2">Last Updated: February 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-8 text-[#c092c9] leading-relaxed">
                        <section className="bg-[#1f1122]/30 border border-white/5 p-8 rounded-[32px]">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p>
                                At AIO REXPO QR, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
                            </p>
                        </section>

                        <section className="bg-[#1f1122]/30 border border-white/5 p-8 rounded-[32px]">
                            <h2 className="text-2xl font-bold text-white mb-4">2. Information Collection</h2>
                            <p>
                                We collect information that you voluntarily provide to us when you:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Create a Bio Page (name, role, avatar image, and social links).</li>
                                <li>Generate QR codes with custom URLs.</li>
                                <li>Sign up or log in using our authentication system.</li>
                            </ul>
                            <p className="mt-4">
                                Additionally, we may automatically collect certain information such as your IP address, browser type, and usage data to improve our services.
                            </p>
                        </section>

                        <section className="bg-[#1f1122]/30 border border-white/5 p-8 rounded-[32px]">
                            <h2 className="text-2xl font-bold text-white mb-4">3. Use of Information</h2>
                            <p>
                                The information collected is used for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>To provide and maintain our service.</li>
                                <li>To allow users to customize and save their QR codes and Bio Pages.</li>
                                <li>To improve our user interface and experience.</li>
                                <li>To display personalized advertisements via Google AdSense.</li>
                            </ul>
                        </section>

                        <section className="bg-[#1f1122]/30 border border-white/5 p-8 rounded-[32px]">
                            <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
                            <p>
                                We use third-party services to enhance our platform:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Google AdSense:</strong> We show ads to keep this service free. Google uses cookies to serve ads based on your visit to this and other sites.</li>
                                <li><strong>Firebase:</strong> We use Firebase for database management and secure user authentication.</li>
                            </ul>
                        </section>

                        <section className="bg-[#1f1122]/30 border border-white/5 p-8 rounded-[32px]">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions or concerns about this Privacy Policy, please contact us via our official channels.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
