import React from 'react';
import { Lock, FileCheck, Sprout, FlaskConical, Calendar } from 'lucide-react';

const StaticQr: React.FC = () => {
    return (
        <section id="static-qr" className="py-20 bg-stone-50 border-t border-stone-200 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-stone-200 rounded-full mb-4">
                        <Lock className="h-6 w-6 text-stone-700" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Static QR Code by apnaQR</h2>
                    <p className="mt-4 text-xl text-stone-600 max-w-3xl mx-auto">
                        Mandatory for Government compliance. Contains fixed information that cannot be changed once generated.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-xl shadow-md border border-stone-100 hover:border-brand-green transition-all group">
                        <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-green transition-colors">
                            <FileCheck className="h-6 w-6 text-brand-green group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3">Govt Notification</h3>
                        <p className="text-stone-600">Displays the Gazette Notification Number & Date as required by verification authorities.</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-xl shadow-md border border-stone-100 hover:border-brand-green transition-all group">
                        <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-green transition-colors">
                            <Sprout className="h-6 w-6 text-brand-green group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3">Product Details</h3>
                        <p className="text-stone-600">Encodes the Title of the Biostimulant and specific Crops it is intended for.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-xl shadow-md border border-stone-100 hover:border-brand-green transition-all group">
                        <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-green transition-colors">
                            <FlaskConical className="h-6 w-6 text-brand-green group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3">Composition & Dosage</h3>
                        <p className="text-stone-600">Permanent record of chemical composition and recommended dosage instructions.</p>
                    </div>
                </div>

                <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6 flex items-start gap-4 max-w-4xl mx-auto">
                    <div className="p-2 bg-amber-100 rounded-full flex-shrink-0">
                        <Lock className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                        <h4 className="text-amber-900 font-bold text-lg">Important Note</h4>
                        <p className="text-amber-800">
                            Once generated, Static QR data is permanent and cannot be edited. It serves as a digital seal of authenticity for Government inspectors and farmers.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StaticQr;