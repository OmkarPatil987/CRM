import React from 'react';
import { FileText, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

const ComplianceSection: React.FC = () => {
    const purposes = [
        { icon: <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />, text: "Verify authenticity of agri products" },
        { icon: <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />, text: "Prevent fake and duplicate products" },
        { icon: <Search className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />, text: "Provide transparent product information" },
        { icon: <FileText className="h-5 w-5 md:h-6 md:w-6 text-stone-600" />, text: "Enable farmers to access correct usage details" },
    ];

    return (
        <section id="compliance" className="py-12 md:py-20 bg-white scroll-mt-24">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                {/* Grid switches from 1 column on mobile to 2 columns on medium screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* Left Content Column */}
                    <div className="text-left">
                        <h2 className="text-emerald-700 font-bold text-sm md:text-lg mb-2 uppercase tracking-widest">
                            Government Mandate
                        </h2>
                        <h3 className="text-2xl md:text-4xl font-extrabold text-stone-900 mb-5 leading-tight">
                            Why QR Code on Agri Product Labels?
                        </h3>

                        <div className="bg-stone-50 border-l-4 border-amber-400 p-5 md:p-6 rounded-r-xl mb-6 shadow-sm">
                            <p className="text-stone-700 italic text-base md:text-lg leading-relaxed">
                                "As per the Fertilizer Control Order (FCO), 1985 and the Ministry of Agriculture & Farmers Welfare, Government of India, it is mandatory to print a QR Code on biostimulant product labels."
                            </p>
                        </div>

                        <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                            <span className="font-semibold text-emerald-800">apnaQR</span> is developed specifically to support these Government requirements in a simple, reliable, and cost-effective way for manufacturers across India.
                        </p>
                    </div>

                    {/* Right Card Column */}
                    <div className="bg-emerald-50 rounded-3xl p-6 md:p-8 border border-emerald-100 shadow-sm">
                        <h4 className="text-lg md:text-xl font-bold text-stone-900 mb-6 border-b border-emerald-200 pb-4">
                            Key Objectives of the Mandate
                        </h4>
                        <div className="space-y-5">
                            {purposes.map((item, index) => (
                                <div key={index} className="flex items-start group">
                                    <div className="flex-shrink-0 mt-1 p-1 bg-white rounded-lg shadow-sm">
                                        {item.icon}
                                    </div>
                                    <p className="ml-4 text-base md:text-lg text-stone-700 font-medium leading-snug">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ComplianceSection;