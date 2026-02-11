import React from 'react';
import { RefreshCw, Smartphone, Video, FileText, BarChart3 } from 'lucide-react';

const DynamicQr: React.FC = () => {
    return (
        <section id="dynamic-qr" className="py-20 bg-white relative overflow-hidden scroll-mt-24">
            {/* Decorative BG */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-emerald-50/50 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="lg:grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Mobile Mockup */}
                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            {/* Device Mockup Wrapper */}
                            <div className="bg-stone-900 rounded-[3rem] p-3 shadow-2xl max-w-sm mx-auto border-[6px] border-stone-800 relative z-10">
                                {/* Speaker/Notch Area */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-900 rounded-b-3xl z-20"></div>

                                <div className="bg-white rounded-[2.5rem] overflow-hidden h-[600px] relative">
                                    {/* Phone Screen Header */}
                                    <div className="bg-emerald-600 h-20 p-6 pt-8 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg tracking-wide">Product Profile</span>
                                    </div>

                                    {/* Phone Screen Content - Using your Image */}
                                    <div className="h-full w-full overflow-hidden bg-stone-50">
                                        <img
                                            src="/images/home/p6.webp"
                                            alt="Dynamic QR Content Preview"
                                            className="w-full h-full object-cover object-top"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Floating real-time update badge */}
                            <div className="absolute top-1/3 -right-4 lg:-right-8 bg-white p-5 rounded-2xl shadow-xl border border-stone-100 z-20 animate-bounce transition-all duration-1000" style={{ animationDuration: '3s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2.5 rounded-full">
                                        <RefreshCw className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-black text-stone-900 text-sm">Real-time Updates</p>
                                        <p className="text-xs text-stone-500 leading-none">Changes reflect instantly</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Text Content */}
                    <div className="order-1 lg:order-2 mb-12 lg:mb-0">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-6">
                            <Smartphone className="h-7 w-7 text-emerald-700" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-6 leading-tight">
                            Dynamic QR Code <br />
                            <span className="text-emerald-600">Smart Features</span>
                        </h2>
                        <p className="text-lg text-stone-600 mb-10 leading-relaxed">
                            Go beyond compliance. Use Dynamic QR codes to engage with farmers, build trust, and update product information instantly without reprinting labels.
                        </p>

                        <ul className="space-y-8">
                            {[
                                { icon: <RefreshCw className="text-blue-500" />, title: "Update Anytime", desc: "Change product details, safety instructions, or dosage without changing the QR label." },
                                { icon: <Video className="text-red-500" />, title: "Rich Media", desc: "Show usage videos, PDF manuals, and high-quality product images." },
                                { icon: <FileText className="text-emerald-600" />, title: "Detailed Description", desc: "Crop-wise application methods and safety precautions in local languages." },
                                { icon: <BarChart3 className="text-purple-500" />, title: "Manufacturer Dashboard", desc: "Manage all your products and updates from a single, easy-to-use apnaQR dashboard." },
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-5 group">
                                    <div className="flex-shrink-0 mt-1 bg-white p-3 rounded-xl shadow-sm border border-stone-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all duration-300">
                                        {React.cloneElement(item.icon as React.ReactElement, { className: `h-6 w-6 ${item.icon.props.className}` })}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-stone-900 mb-1 group-hover:text-emerald-700 transition-colors">{item.title}</h4>
                                        <p className="text-stone-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DynamicQr;