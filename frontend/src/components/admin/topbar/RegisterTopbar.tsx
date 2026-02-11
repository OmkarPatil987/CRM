import React, { useState, useEffect } from 'react';
import { Menu, X, QrCode, LogIn, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Compliance', href: '#compliance' },
        { name: 'Static QR', href: '#static-qr' },
        { name: 'Dynamic QR', href: '#dynamic-qr' },
        { name: 'Benefits', href: '#benefits' },
    ];

    return (
        /* FIXED: Changed to solid emerald-700 background. 
           Added transition for padding on scroll. 
        */
        <nav className={`sticky top-0 w-full z-50 transition-all duration-300 bg-emerald-700 ${scrolled ? 'py-1 shadow-2xl' : 'py-3'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        {/* Lightened the logo background for contrast on green */}
                        <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                            <QrCode className="h-7 w-7 text-white" />
                        </div>
                        <span className="font-bold text-2xl text-white tracking-tight">
                            apna<span className="text-emerald-200">QR</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                /* Changed text to white with an emerald hover effect */
                                className="px-4 py-2 text-emerald-50 hover:text-white font-medium rounded-full hover:bg-white/10 transition-all duration-200"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="h-6 w-[1px] bg-emerald-600/50 mx-4" />

                        <button
                            onClick={() => navigate('/auth/login')}
                            /* Changed login button to a white solid button for visibility */
                            className="flex items-center gap-2 px-5 py-2 bg-white text-emerald-800 rounded-full font-bold hover:bg-emerald-50 transition-colors"
                        >
                            <LogIn className="h-4 w-4" />
                            Login
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute w-full bg-emerald-800 border-t border-emerald-600 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}>
                <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-base font-medium text-emerald-50 hover:text-white hover:bg-white/10"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;