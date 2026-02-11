import React from 'react';
import { Factory, Landmark, Sprout, Quote } from 'lucide-react';

const AboutSection: React.FC = () => {
    return (
        /* Section with a soft green shade background */
        <section className="py-20 bg-emerald-50/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                {/* Header with Emerald accent */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-4">
                        About <span className="text-emerald-700">apnaQR</span>
                    </h2>
                    <div className="h-1.5 w-20 bg-emerald-600 mx-auto rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Main description paragraph */}
                    <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-12">
                        <span className="font-bold text-emerald-700">apnaQR</span> is a dedicated QR Code generation platform developed with a singular focus: to support agri-product manufacturers in meeting the strict compliance standards of the
                        <span className="font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded ml-1">Fertilizer Control Order (FCO) 1985</span>.
                    </p>

                    {/* Feature Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {/* Card 1: Manufacturers */}
                        <div className="p-8 bg-white rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow group text-center">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors">
                                <Factory className="h-7 w-7 text-emerald-700 group-hover:text-white" />
                            </div>
                            <h3 className="font-bold text-lg text-stone-900 mb-2">Manufacturers</h3>
                            <p className="text-sm text-stone-600 leading-relaxed">
                                Empowering brands with digital tools for seamless data management.
                            </p>
                        </div>

                        {/* Card 2: Government */}
                        <div className="p-8 bg-white rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow group text-center">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors">
                                <Landmark className="h-7 w-7 text-emerald-700 group-hover:text-white" />
                            </div>
                            <h3 className="font-bold text-lg text-stone-900 mb-2">Government</h3>
                            <p className="text-sm text-stone-600 leading-relaxed">
                                Ensuring regulatory compliance and transparent audit trails.
                            </p>
                        </div>

                        {/* Card 3: Farmers */}
                        <div className="p-8 bg-white rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow group text-center">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors">
                                <Sprout className="h-7 w-7 text-emerald-700 group-hover:text-white" />
                            </div>
                            <h3 className="font-bold text-lg text-stone-900 mb-2">Farmers</h3>
                            <p className="text-sm text-stone-600 leading-relaxed">
                                Providing clear usage knowledge and product authenticity.
                            </p>
                        </div>
                    </div>

                    {/* Motivational Quote Section */}
                    <div className="relative p-10 bg-emerald-700 rounded-3xl overflow-hidden shadow-xl">
                        {/* Decorative Quote Icon */}
                        <Quote className="absolute -top-4 -left-4 h-24 w-24 text-white/10" />

                        <p className="relative z-10 font-bold text-xl md:text-2xl text-white italic leading-snug">
                            "Our goal is to create a trusted digital bridge between manufacturers, Government authorities, and farmers."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;