import React from 'react';
import { UserPlus, UploadCloud, QrCode, ScanFace, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks: React.FC = () => {

    const navigate = useNavigate();
    const steps = [
        {
            icon: <UserPlus className="h-8 w-8" />,
            title: "Register",
            desc: "Manufacturer registers on www.apnaQR.co.in",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: <UploadCloud className="h-8 w-8" />,
            title: "Upload Details",
            desc: "Enter product composition, dosage, and select Static or Dynamic QR.",
            color: "bg-orange-100 text-orange-600"
        },
        {
            icon: <QrCode className="h-8 w-8" />,
            title: "Generate QR",
            desc: "apnaQR instantly creates the compliant QR Code for your label.",
            color: "bg-emerald-100 text-emerald-600"
        },
        {
            icon: <ScanFace className="h-8 w-8" />,
            title: "Farmer Scans",
            desc: "Farmers scan the label to verify authenticity and view details.",
            color: "bg-purple-100 text-purple-600"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold tracking-wider uppercase text-sm">Simple Process</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-2">How apnaQR Works</h2>
                    <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
                        Get your products compliant and market-ready in 4 simple steps.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-stone-200 -z-0"></div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                                <div className={`w-24 h-24 rounded-full ${step.color} border-4 border-white shadow-lg flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 duration-300`}>
                                    {step.icon}
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all w-full min-h-[180px]">
                                    <div className="inline-block bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 rounded-full mb-3">STEP 0{index + 1}</div>
                                    <h3 className="text-xl font-bold text-stone-900 mb-2">{step.title}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;