import React from 'react';
import { Shield, Scale, FileText, CheckCircle } from 'lucide-react';

export const LegalPages: React.FC = () => {
    return (
        <div className="bg-stone-50 min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="bg-emerald-700 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Compliance Hub
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black mt-4 mb-2">Legal & Guidelines</h1>
                        <p className="text-emerald-100 opacity-90">Last Updated: February 2026</p>
                    </div>
                    <FileText className="absolute -bottom-6 -right-6 h-48 w-48 text-white/10" />
                </div>

                {/* Main Content Area */}
                <div className="space-y-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100">

                    {/* Privacy Policy Section */}
                    <section id="privacy">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="text-emerald-600 h-8 w-8" />
                            <h2 className="text-2xl font-bold text-stone-900">Privacy Policy</h2>
                        </div>
                        <div className="prose prose-emerald text-stone-600 max-w-none space-y-4">
                            <p>At <strong>apnaQR</strong>, we prioritize the security of your agricultural data. We collect information necessary for QR generation, including product details and manufacturing batches.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Data is encrypted using industry-standard SSL protocols.</li>
                                <li>We do not share manufacturer-specific data with third-party marketers.</li>
                                <li>Product URLs are public, but dashboard access is restricted to authorized users.</li>
                            </ul>
                        </div>
                    </section>

                    <hr className="border-stone-100" />

                    {/* Terms of Service Section */}
                    <section id="terms">
                        <div className="flex items-center gap-3 mb-6">
                            <Scale className="text-emerald-600 h-8 w-8" />
                            <h2 className="text-2xl font-bold text-stone-900">Terms of Service</h2>
                        </div>
                        <div className="prose prose-emerald text-stone-600 space-y-4">
                            <p>By using apnaQR, you agree to provide accurate product information as per the FCO 1985 mandates.</p>
                            <p className="bg-stone-50 p-4 border-l-4 border-emerald-500 italic">
                                "The user is solely responsible for the authenticity of the data encoded in the QR codes generated."
                            </p>
                        </div>
                    </section>

                    <hr className="border-stone-100" />

                    {/* FCO Guidelines Section */}
                    <section id="fco">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="text-emerald-600 h-8 w-8" />
                            <h2 className="text-2xl font-bold text-stone-900">FCO 1985 Guidelines</h2>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h3 className="font-bold text-emerald-900 mb-3 text-lg">Mandatory QR Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    'Product Composition',
                                    'Manufacturer Address',
                                    'Batch/Lot Number',
                                    'Manufacturing & Expiry Date',
                                    'Recommended Dosage',
                                    'Government License Number'
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-emerald-800 text-sm">
                                        <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};