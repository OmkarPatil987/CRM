import React from 'react';
import { ArrowRight, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom'; // Added Link for navigation

const Footer: React.FC = () => {
    return (
        <footer className="bg-stone-900 text-stone-300">
            {/* Final CTA Strip */}
            <div className="bg-emerald-600 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Make Your Agri Products Government-Compliant
                        </h2>
                        <p className="text-emerald-50">
                            Start generating Static & Dynamic QR codes today.
                        </p>
                    </div>
                    {/* Updated to Link for internal navigation */}
                    <Link
                        to="/auth/login"
                        className="bg-white text-emerald-700 hover:bg-stone-100 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-transform hover:-translate-y-1 flex items-center"
                    >
                        Get Started with apnaQR
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <QrCode className="h-8 w-8 text-emerald-500" />
                            <span className="font-bold text-2xl text-white tracking-tight">apna<span className="text-emerald-500">QR</span></span>
                        </div>
                        <p className="text-stone-400 mb-6 max-w-sm">
                            The trusted platform for digital compliance in Indian Agriculture. Bridging the gap between authenticity and technology.
                        </p>
                        <p className="font-semibold text-white">Visit: www.apnaQR.co.in</p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><a href="#compliance" className="hover:text-emerald-500 transition-colors">Compliance</a></li>
                            <li><a href="#static-qr" className="hover:text-emerald-500 transition-colors">Static QR</a></li>
                            <li><a href="#dynamic-qr" className="hover:text-emerald-500 transition-colors">Dynamic QR</a></li>
                            <li><a href="#benefits" className="hover:text-emerald-500 transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Legal & Support</h3>
                        <ul className="space-y-4">
                            {/* Updated to Links pointing to the sections/pages created */}
                            <li>
                                <Link to="/privacy-policy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms-of-service" className="hover:text-emerald-500 transition-colors">Terms of Service</Link>
                            </li>
                         
                            <li>
                                <Link to="/contact-support" className="hover:text-emerald-500 transition-colors font-semibold text-emerald-400">Contact Support</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-800 mt-12 pt-8 text-center text-sm text-stone-500">
                    <p>&copy; {new Date().getFullYear()} apnaQR. All rights reserved. Made for Indian Agriculture.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;