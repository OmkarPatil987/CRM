import React from 'react';
import { Check, X, RefreshCw, Lock, Zap, FileText } from 'lucide-react';

const QRComparison: React.FC = () => {
    const comparisonData = [
        { feature: 'Data Type', static: 'Fixed information', dynamic: 'Changeable information', icon: <FileText size={18} /> },
        { feature: 'Editable After Creation', static: false, dynamic: true, icon: <RefreshCw size={18} /> },
        { feature: 'Label Reprinting', static: 'Required on every change', dynamic: 'Never required', icon: <Zap size={18} /> },
        { feature: 'Content Update Method', static: 'Not possible', dynamic: 'Online dashboard', icon: <Lock size={18} /> },
        { feature: 'Real-Time Updates', static: false, dynamic: true, icon: <Zap size={18} /> },
        { feature: 'Best For', static: 'Fixed data products', dynamic: 'Growing brands', icon: <Check size={18} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-stone-900 mb-2">Static vs Dynamic QR Codes</h2>
                <p className="text-stone-600">Choose the right technology for your agricultural packaging</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 bg-stone-50 border-b border-stone-200">
                    <div className="p-6 font-bold text-stone-500 uppercase text-sm tracking-wider hidden md:block">Feature</div>
                    <div className="p-6 font-bold text-stone-800 text-center text-lg bg-stone-100/50">Static QR Code</div>
                    <div className="p-6 font-bold text-emerald-700 text-center text-lg bg-emerald-50">Dynamic QR Code</div>
                </div>

                {comparisonData.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                        {/* Feature Label (Mobile & Desktop) */}
                        <div className="p-4 md:p-6 flex items-center gap-3 text-stone-700 font-semibold bg-stone-50 md:bg-transparent">
                            <span className="text-emerald-600">{item.icon}</span>
                            {item.feature}
                        </div>

                        {/* Static Column */}
                        <div className="p-4 md:p-6 text-center flex items-center justify-center border-r border-stone-100 text-stone-600">
                            {typeof item.static === 'boolean' ? (
                                item.static ? <Check className="text-emerald-500" /> : <X className="text-rose-400" />
                            ) : (
                                item.static
                            )}
                        </div>

                        {/* Dynamic Column */}
                        <div className="p-4 md:p-6 text-center flex items-center justify-center bg-emerald-50/30 font-medium text-emerald-900">
                            {typeof item.dynamic === 'boolean' ? (
                                item.dynamic ? <Check className="text-emerald-600" /> : <X className="text-rose-400" />
                            ) : (
                                item.dynamic
                            )}
                        </div>
                    </div>
                ))}

                {/* Use Case Footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 bg-stone-900 text-white">
                    <div className="p-6 font-bold uppercase text-xs tracking-widest flex items-center">Typical Use Cases</div>
                    <div className="p-6 text-sm text-stone-300 border-r border-stone-700">
                        MFG Date, Expiry, Batch Number, Lot Identification.
                    </div>
                    <div className="p-6 text-sm text-emerald-200 bg-emerald-900/50">
                        Product info, Marketing links, Lab certificates, and Real-time updates.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRComparison;