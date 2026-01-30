import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Palette, Globe, Smartphone, BarChart } from 'lucide-react';

const LandingContent: React.FC = () => {
    const features = [
        {
            icon: <Palette className="text-[#ce2bee]" size={24} />,
            title: "Fully Customizable",
            description: "Customize colors, backgrounds, and styles to match your brand identity perfectly. Create unique QR codes that stand out."
        },
        {
            icon: <Zap className="text-[#ce2bee]" size={24} />,
            title: "Instant Generation",
            description: "Generate high-quality QR codes in milliseconds. No waiting time, instant preview, and high-resolution downloads."
        },
        {
            icon: <Shield className="text-[#ce2bee]" size={24} />,
            title: "Privacy Focused",
            description: "Your data is secure. We prioritize user privacy and ensure that your information is handled with the utmost care."
        },
        {
            icon: <Globe className="text-[#ce2bee]" size={24} />,
            title: "Universal Compatibility",
            description: "Our QR codes are compatible with all modern QR code readers and smartphone cameras, ensuring a seamless scanning experience."
        },
        {
            icon: <Smartphone className="text-[#ce2bee]" size={24} />,
            title: "Mobile Optimized",
            description: "Create Bio Pages that look stunning on every device. Fully responsive designs that adapt to any screen size."
        },
        {
            icon: <BarChart className="text-[#ce2bee]" size={24} />,
            title: "Analytics Ready",
            description: "Track your QR code performance. (Coming soon) features will help you understand your audience better."
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-16 sm:py-24 space-y-24">
            {/* Introduction Section */}
            <section className="space-y-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        The Ultimate <span className="text-[#ce2bee]">QR Code & Bio Link</span> Solution
                    </h2>
                    <p className="text-[#c092c9] text-lg max-w-3xl mx-auto leading-relaxed">
                        AIO REXPO QR is a powerful, free-to-use tool designed to bridge the gap between the physical and digital worlds.
                        Whether you need a simple QR code for your website, a complex customized design for your brand, or a comprehensive
                        Link in Bio page, we have you covered.
                    </p>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-[#1f1122]/30 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-[#1f1122]/50 transition-colors"
                        >
                            <div className="w-12 h-12 bg-[#ce2bee]/10 rounded-xl flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-[#c092c9]/80 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Educational Content / Guide */}
            <section className="bg-[#1f1122]/20 border border-white/5 rounded-[40px] p-8 sm:p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl sm:text-3xl font-black text-white">How to Create a Custom QR Code</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#ce2bee] flex items-center justify-center text-white font-bold shrink-0">1</div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Enter Your Content</h4>
                                    <p className="text-[#c092c9] text-sm mt-1">Paste your URL, text, or contact information into the input field.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#ce2bee] flex items-center justify-center text-white font-bold shrink-0">2</div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Customize the Design</h4>
                                    <p className="text-[#c092c9] text-sm mt-1">Choose your foreground and background colors to match your brand's aesthetic.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#ce2bee] flex items-center justify-center text-white font-bold shrink-0">3</div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Download & Share</h4>
                                    <p className="text-[#c092c9] text-sm mt-1">Download your high-resolution QR code and start sharing it with the world.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl sm:text-3xl font-black text-white">Why Use QR Codes?</h3>
                        <div className="space-y-4 text-[#c092c9]">
                            <p>
                                QR codes (Quick Response codes) are 2D barcodes that can store much more data than standard barcodes.
                                They bridge the physical world to the digital realm, allowing instant access to websites, social media,
                                wifi networks, and more just by scanning with a smartphone.
                            </p>
                            <p>
                                In today's touch-free digital economy, QR codes are essential for menus, marketing materials,
                                business cards, and payment systems. AIO REXPO QR gives you the tools to leverage this technology
                                for free, with professional-grade features and reliability.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SEO / FAQ Section */}
            <section className="space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-[#c092c9]">Everything you need to know about our QR Generator</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#0a050c] border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-white font-bold mb-2">Is this service really free?</h4>
                        <p className="text-[#c092c9] text-sm">Yes! AIO REXPO QR is 100% free to use for creating standard and custom QR codes. We believe in accessible tools for everyone.</p>
                    </div>
                    <div className="bg-[#0a050c] border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-white font-bold mb-2">Do the QR codes expire?</h4>
                        <p className="text-[#c092c9] text-sm">Static QR codes generated with our tool never expire. They will work forever as long as your destination URL is active.</p>
                    </div>
                    <div className="bg-[#0a050c] border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-white font-bold mb-2">Can I use the QR codes for commercial purposes?</h4>
                        <p className="text-[#c092c9] text-sm">Absolutely. You are free to use the QR codes generated here for any personal or commercial projects without restrictions.</p>
                    </div>
                    <div className="bg-[#0a050c] border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-white font-bold mb-2">What is a Link in Bio page?</h4>
                        <p className="text-[#c092c9] text-sm">A Link in Bio page is a mini-website that houses all your important links. It's perfect for social media profiles like Instagram where you only get one link.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingContent;
