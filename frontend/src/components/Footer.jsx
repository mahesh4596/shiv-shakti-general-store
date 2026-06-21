import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Heart, MapPin, Mail, Phone, Sparkles } from 'lucide-react';

function Footer() {
    return (
        <footer className="relative bg-white py-10 overflow-hidden border-t border-pink-50">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-50 rounded-full blur-[120px] opacity-50 -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-50 rounded-full blur-[120px] opacity-50 -z-10"></div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-8">
                    {/* Brand Story Column */}
                    <div className="lg:col-span-5 space-y-6">
                        <Link to="/" className="inline-block group">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">
                                SHIV SHAKTI
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 font-serif italic font-normal text-2xl mt-1 group-hover:tracking-normal transition-all duration-500">
                                    General Store.
                                </span>
                            </h2>
                        </Link>
                        <p className="text-gray-400 font-medium text-base leading-relaxed max-w-md">
                            Crafting a legacy of beauty since 2025. We bring you the finest collection of premium cosmetics and essentials for your daily glow.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Menu Columns - Nested Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] flex items-center gap-2">
                                <Sparkles size={10} /> Navigation
                            </h4>
                            <ul className="space-y-2">
                                {['Home', 'Privacy', 'Terms'].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                                            className="text-gray-400 hover:text-pink-500 font-bold transition-all text-sm"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] flex items-center gap-2">
                                <MapPin size={10} /> The Boutique
                            </h4>
                            <div className="space-y-2 text-gray-400 font-bold text-xs leading-relaxed">
                                <p>4728/9 Gandhi Market, Bathinda</p>
                                <p>Daily: 10AM - 9PM</p>
                            </div>
                        </div>

                        <div className="space-y-4 col-span-2 md:col-span-1">
                            <h4 className="text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] flex items-center gap-2">
                                <Mail size={10} /> Contact Us
                            </h4>
                            <div className="space-y-2 text-gray-400 font-bold text-xs">
                                <a href="mailto:hello@shivshakti.com" className="block hover:text-pink-500 transition-colors">hell0@shivshakti.com</a>
                                <a href="tel:+917009878040" className="block hover:text-pink-500 transition-colors">+91 7009878040</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar Styling (Compacted) */}
                <div className="border-t border-pink-50 pt-8 mt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Handcrafted Pill */}
                        <div className="inline-flex items-center gap-3 bg-pink-50/40 px-6 py-3 rounded-full border border-pink-100/50">
                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none">Handcrafted With</span>
                            <Heart size={12} className="text-pink-300 fill-pink-300" />
                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none">By Shiv Shakti Team</span>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-2">
                            <div className="flex gap-8 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <Link to="/privacy" className="hover:text-pink-500 transition-all">Security</Link>
                                <Link to="/terms" className="hover:text-pink-500 transition-all">Legal</Link>
                            </div>
                            <p className="text-[9px] font-black text-gray-400/30 uppercase tracking-[0.4em]">
                                © 2025 SHIV SHAKTI GENERAL STORE.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;