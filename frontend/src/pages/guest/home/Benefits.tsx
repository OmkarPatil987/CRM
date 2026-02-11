import React from 'react';
import { ShieldCheck, Zap, LayoutDashboard, BadgeIndianRupee, ThumbsUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Benefits: React.FC = () => {
    const data = [
        { name: 'Q1', value: 20 },
        { name: 'Q2', value: 45 },
        { name: 'Q3', value: 70 },
        { name: 'Q4', value: 95 },
    ];

    const benefits = [
        { icon: <ShieldCheck className="h-6 w-6" />, title: "Govt Compliant", desc: "Designed strictly as per FCO 1985 guidelines." },
        { icon: <Zap className="h-6 w-6" />, title: "Easy Generation", desc: "Generate thousands of QRs in seconds." },
        { icon: <LayoutDashboard className="h-6 w-6" />, title: "Single Dashboard", desc: "Manage multiple products from one place." },
        { icon: <Users className="h-6 w-6" />, title: "Farmer Trust", desc: "Builds confidence with transparent data." },
        { icon: <BadgeIndianRupee className="h-6 w-6" />, title: "Cost Effective", desc: "Affordable plans for all manufacturer sizes." },
        { icon: <ThumbsUp className="h-6 w-6" />, title: "Brand Safety", desc: "Prevents counterfeit and duplicate products." },
    ];

    return (
        <section id="benefits" className="py-20 bg-stone-50 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Why Choose apnaQR?</h2>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        The preferred choice for agri-input manufacturers across India for compliance and digital growth.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Chart Card - Simulating Trust/Growth */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-stone-200">
                        <h3 className="text-xl font-bold text-stone-900 mb-2">Rising Farmer Trust</h3>
                        <p className="text-sm text-stone-500 mb-6">Adoption of verified QR codes leads to higher brand engagement.</p>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: '#f5f5f4' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 3 ? '#166534' : '#86efac'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-stone-400 mt-4">*Illustrative data representation</p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                        {benefits.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow flex items-start gap-4">
                                <div className="flex-shrink-0 bg-emerald-50 p-3 rounded-lg text-brand-green">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 text-lg mb-1">{item.title}</h4>
                                    <p className="text-stone-600 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Benefits;