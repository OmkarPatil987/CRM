"use client"

import React, { useState } from 'react';
import {
    Home, ChevronDown, Heart,
    Globe, FileText, Image as ImageIcon, Video, Wifi,
    Utensils, Briefcase, Contact, Music, Smartphone,
    List, Tag, Facebook, Instagram, Share2, MessageCircle,
    ArrowRight, X
} from 'lucide-react';

const QRGenerator = () => {
    const [selectedType, setSelectedType] = useState('url');
    const [previewTab, setPreviewTab] = useState('preview'); // 'preview' or 'qrcode'

    // Data for QR Types to map through (matches the HTML provided)
    const qrTypes = [
        { id: 'url', icon: <Globe size={24} />, title: 'Website', desc: 'Link to any website URL' },
        { id: 'pdf', icon: <FileText size={24} />, title: 'PDF', desc: 'Show a PDF' },
        { id: 'links', icon: <List size={24} />, title: 'List of Links', desc: 'Share multiple links' },
        { id: 'vcard', icon: <Contact size={24} />, title: 'vCard', desc: 'Share a digital business card' },
        { id: 'business', icon: <Briefcase size={24} />, title: 'Business', desc: 'Share business info' },
        { id: 'video', icon: <Video size={24} />, title: 'Video', desc: 'Show a video' },
        { id: 'images', icon: <ImageIcon size={24} />, title: 'Images', desc: 'Share multiple images' },
        { id: 'facebook', icon: <Facebook size={24} />, title: 'Facebook', desc: 'Share Facebook page' },
        { id: 'instagram', icon: <Instagram size={24} />, title: 'Instagram', desc: 'Share Instagram' },
        { id: 'social', icon: <Share2 size={24} />, title: 'Social Media', desc: 'Share social channels' },
        { id: 'whatsapp', icon: <MessageCircle size={24} />, title: 'WhatsApp', desc: 'Get WhatsApp messages' },
        { id: 'mp3', icon: <Music size={24} />, title: 'MP3', desc: 'Share an audio file' },
        { id: 'menu', icon: <Utensils size={24} />, title: 'Menu', desc: 'Create a restaurant menu' },
        { id: 'app', icon: <Smartphone size={24} />, title: 'Apps', desc: 'Redirect to app store' },
        { id: 'coupon', icon: <Tag size={24} />, title: 'Coupon', desc: 'Share a coupon' },
        { id: 'wifi', icon: <Wifi size={24} />, title: 'WiFi', desc: 'Connect to Wi-Fi' },
    ];

    return (
        <div className="font-sans text-[#333] bg-[#f4f6f8] min-h-screen pt-20">

            {/* --- HEADER (From ChoiceProperty) --- */}
            <header className="fixed top-0 left-0 w-full h-16 bg-[#1E3A8A] border-b border-blue-900 z-50 flex items-center px-4 justify-between shadow-lg">
                <div className="flex items-center h-full">

                    {/* Logo Section with Blur BG & Serif Font */}
                    <div className="mr-8 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/10 shadow-sm transition-all hover:bg-white/20 cursor-pointer">
                        {/* Yellow Icon Box */}
                        <div className="w-8 h-8 bg-[#FFD916] rounded-md flex items-center justify-center shadow-sm">
                            <Home className="text-[#1E3A8A]" size={20} strokeWidth={2.5} />
                        </div>
                        {/* Text */}
                        <span className="text-2xl font-serif font-bold text-white tracking-wide">
                            Choice <span className="text-[#FFD916]">Property</span>
                        </span>
                    </div>

                    {/* City Dropdown */}
                    <div className="hidden md:flex items-center h-full border-r border-blue-700 pr-4 mr-4 cursor-pointer text-gray-200 hover:text-white text-[13px] transition-colors">
                        <span>Mumbai</span>
                        <ChevronDown size={14} className="ml-2" />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex h-full items-center">
                        {['Buy', 'Rent', 'Services', 'Resources'].map((item) => (
                            <div key={item} className="h-full flex items-center px-4 text-gray-200 hover:text-white hover:font-semibold cursor-pointer text-[13px] relative group transition-all">
                                {item}
                                <ChevronDown size={12} className="ml-1 opacity-70 group-hover:opacity-100" />
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Right Side Buttons */}
                <div className="flex items-center gap-3">
                    <button className="hidden xl:flex items-center px-3 h-8 border border-[#FFD916] rounded text-white text-[13px] hover:bg-[#FFD916] hover:text-[#1E3A8A] transition-colors">
                        <span className="bg-[#FFD916] text-[#1E3A8A] font-bold text-[10px] px-1 rounded mr-1">Data</span> Intelligence
                    </button>
                    <div className="w-8 h-8 flex items-center justify-center cursor-pointer">
                        <Heart className="text-white hover:text-[#F05252] transition-colors" size={20} />
                    </div>
                    <button className="bg-transparent border border-white text-white px-5 py-1 rounded text-[13px] hover:bg-white hover:text-[#1E3A8A] font-medium transition-colors">
                        Login
                    </button>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Easily create a <span className="text-[#1E3A8A]">QR code</span> for any occasion in seconds!
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative">

                    {/* LEFT COLUMN: QR Types Grid */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-6 border-b border-gray-100 pb-3">
                                1. Select a type of QR code
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {qrTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`
                                            relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-between group
                                            ${selectedType === type.id
                                                ? 'border-[#1E3A8A] bg-blue-50 shadow-md'
                                                : 'border-gray-100 hover:border-blue-200 hover:shadow-sm bg-white'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                                                ${selectedType === type.id ? 'bg-[#1E3A8A] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-[#1E3A8A]'}
                                            `}>
                                                {type.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-gray-800">{type.title}</span>
                                                <span className="text-xs text-gray-500">{type.desc}</span>
                                            </div>
                                        </div>

                                        {/* Selected Indicator Arrow */}
                                        {selectedType === type.id && (
                                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-[#1E3A8A] rounded-full p-1 border-2 border-white">
                                                <ArrowRight size={12} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Mobile Preview (Sticky) */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24">
                            {/* Phone Mockup Container */}
                            <div className="bg-white rounded-[2.5rem] border-8 border-gray-800 shadow-2xl overflow-hidden h-[600px] relative max-w-[320px] mx-auto">

                                {/* Phone Notch/Camera */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-800 rounded-b-xl z-20"></div>

                                {/* Preview / Code Switcher */}
                                <div className="absolute top-8 left-0 w-full z-10 px-4">
                                    <div className="bg-white/90 backdrop-blur rounded-lg p-1 flex shadow-sm border border-gray-200">
                                        <button
                                            onClick={() => setPreviewTab('preview')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${previewTab === 'preview' ? 'bg-[#1E3A8A] text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => setPreviewTab('qrcode')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${previewTab === 'qrcode' ? 'bg-[#1E3A8A] text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            QR code
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Content Area */}
                                <div className="h-full w-full bg-gray-100 pt-20 pb-4 px-2 overflow-y-auto custom-scrollbar">
                                    {previewTab === 'preview' ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                            {/* Simulate Screen Content */}
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                                {qrTypes.find(t => t.id === selectedType)?.icon}
                                            </div>
                                            <h3 className="text-gray-800 font-bold mb-2">
                                                {qrTypes.find(t => t.id === selectedType)?.title} Preview
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Content for {selectedType} will appear here on your mobile device.
                                            </p>

                                            {/* Dummy Lines representing content */}
                                            <div className="w-full h-2 bg-gray-200 rounded mt-8 mb-2"></div>
                                            <div className="w-3/4 h-2 bg-gray-200 rounded mb-2"></div>
                                            <div className="w-5/6 h-2 bg-gray-200 rounded mb-2"></div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                                {/* Placeholder QR Code */}
                                                <div className="w-40 h-40 bg-gray-900 pattern-dots"></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-4 text-center px-4">
                                                Scan to test your {selectedType} QR code
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Close/Exit Button Mock */}
                                <button className="absolute top-2 right-4 z-30 text-gray-500 hover:text-gray-800">
                                    <X size={16} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default QRGenerator;