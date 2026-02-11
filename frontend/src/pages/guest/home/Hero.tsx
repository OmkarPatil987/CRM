import React from 'react';
import { ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-stone-50">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100 opacity-50 blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

                    <div className="lg:col-span-6 text-center lg:text-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6 border border-emerald-200">
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            FCO 1985 Compliant
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
                            Government-Compliant <br />
                            <span className="text-brand-green">QR Code Platform</span> <br />
                            for Agri Products
                        </h1>

                        <p className="text-lg md:text-xl text-stone-600 mb-4 font-medium">
                            Static QR Codes for Biostimulants, Fertilizers & Agricultural Inputs
                        </p>
                        <p className="text-base text-stone-500 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Generate label QRs to ensure government compliance, product authenticity, and provide clear, verified information to farmers.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="flex items-center justify-center bg-brand-green hover:bg-emerald-900 text-white px-8 py-3.5 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Generate QR Code
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>

                            <button className="flex items-center justify-center bg-white border-2 border-stone-200 hover:border-brand-green text-stone-700 hover:text-brand-green px-8 py-3.5 rounded-lg font-semibold text-lg transition-all">
                                <PlayCircle className="mr-2 h-5 w-5" />
                                How apnaQR Works
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-6 mt-12 lg:mt-0 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            {/* Placeholder for Agri Product/Farmer Interaction */}
                            <img
                                src="https://picsum.photos/id/400/800/600"
                                alt="Farmer scanning QR code on fertilizer product"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                <p className="font-semibold text-lg">Verified Authenticity</p>
                                <p className="text-sm opacity-90">Empowering farmers with correct information.</p>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-stone-100 hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <ShieldCheck className="h-6 w-6 text-brand-green" />
                                </div>
                                <div>
                                    <p className="text-sm text-stone-500 font-medium">Compliance Status</p>
                                    <p className="text-stone-900 font-bold">100% Govt Approved</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;