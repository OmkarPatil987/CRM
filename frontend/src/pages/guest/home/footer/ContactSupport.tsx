import React from 'react';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';

export const ContactSupport: React.FC = () => {
    return (
        <div className="bg-stone-50 min-h-screen py-16 px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8">

                {/* Contact Info Sidebar */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-4xl font-black text-stone-900 tracking-tight">
                        How can we <span className="text-emerald-600">help?</span>
                    </h2>
                    <p className="text-stone-600 text-lg">
                        Have questions about FCO compliance or Dynamic QR setup? Our technical team is ready to assist you.
                    </p>

                    <div className="space-y-4 pt-6">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700"><Mail /></div>
                            <div>
                                <p className="text-xs text-stone-400 font-bold uppercase">Email us</p>
                                <p className="font-bold text-stone-800">support@apnaqr.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700"><Phone /></div>
                            <div>
                                <p className="text-xs text-stone-400 font-bold uppercase">Call us</p>
                                <p className="font-bold text-stone-800">+91 (800) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Form Card */}
                <div className="md:col-span-3 bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-emerald-50">
                    <form className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Company Name</label>
                                <input type="text" className="w-full bg-stone-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="AgriCorp Ltd" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Subject</label>
                                <select className="w-full bg-stone-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 transition-all">
                                    <option>Technical Issue</option>
                                    <option>Compliance Query</option>
                                    <option>Billing</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Message</label>
                            <textarea rows={5} className="w-full bg-stone-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="How can we assist you with your QR inventory?"></textarea>
                        </div>
                        <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1">
                            <Send size={18} />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};