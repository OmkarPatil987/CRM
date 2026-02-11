import React from 'react';
import { Scale, AlertCircle, ShieldAlert, Gavel } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <div className="bg-stone-50 min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 bg-emerald-100 rounded-2xl text-emerald-700 mb-4">
                        <Scale size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-stone-900 mb-4">Terms of Service</h1>
                    <p className="text-stone-600 italic">Effective Date: February 1, 2026</p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-10 text-stone-700 leading-relaxed">

                        {/* 1. Acceptance */}
                        <section>
                            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <span className="text-emerald-600">01.</span> Acceptance of Terms
                            </h2>
                            <p>
                                By accessing or using the <strong>apnaQR</strong> platform, you agree to be bound by these Terms of Service. These terms apply to all manufacturers, distributors, and users who access our QR generation and tracking services.
                            </p>
                        </section>

                        {/* 2. Compliance Responsibility */}
                        <section className="bg-emerald-50 rounded-2xl p-6 border-l-4 border-emerald-600">
                            <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                <AlertCircle size={20} />
                                FCO 1985 Compliance
                            </h2>
                            <p className="text-emerald-800 text-sm md:text-base">
                                Manufacturers are solely responsible for ensuring that the data encoded in the QR codes (including chemical composition, manufacturing dates, and license numbers) strictly adheres to the <strong>Fertilizer Control Order (FCO) 1985</strong> and other local agricultural regulations. apnaQR provides the technology; the manufacturer provides the legal data.
                            </p>
                        </section>

                        {/* 3. Account Security */}
                        <section>
                            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <span className="text-emerald-600">02.</span> Account & Security
                            </h2>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials. Any activity performed under your account for generating Dynamic QR codes is your legal responsibility.
                            </p>
                        </section>

                        {/* 4. Prohibited Uses */}
                        <section>
                            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <span className="text-emerald-600">03.</span> Prohibited Use
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-stone-600">
                                <li>Using the platform to generate QR codes for illegal or counterfeit agri-products.</li>
                                <li>Attempting to bypass security protocols or scrape manufacturer data.</li>
                                <li>Modifying Dynamic QR links to redirect users to unauthorized or malicious content.</li>
                            </ul>
                        </section>

                        {/* 5. Limitation of Liability */}
                        <section className="bg-stone-900 rounded-2xl p-8 text-stone-300">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <ShieldAlert size={20} className="text-emerald-400" />
                                Limitation of Liability
                            </h2>
                            <p className="text-sm">
                                <strong>apnaQR</strong> shall not be held liable for any penalties, legal actions, or crop failures resulting from incorrect information provided by the manufacturer. We do not guarantee the performance of products linked via our QR codes, only the availability of the digital link.
                            </p>
                        </section>

                        {/* 6. Governing Law */}
                        <section>
                            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <Gavel size={20} className="text-emerald-600" />
                                Governing Law
                            </h2>
                            <p>
                                These terms are governed by the laws of India. Any disputes arising from the use of this platform shall be subject to the exclusive jurisdiction of the courts in <strong>Pune, Maharashtra</strong>.
                            </p>
                        </section>
                    </div>

                    {/* Footer Contact */}
                    <div className="bg-stone-50 p-8 border-t border-stone-100 text-center">
                        <p className="text-stone-500 text-sm mb-4">
                            Questions about our Terms? Contact our legal team.
                        </p>
                        <a
                            href="mailto:legal@apnaqr.com"
                            className="text-emerald-700 font-bold hover:underline"
                        >
                            legal@apnaqr.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;