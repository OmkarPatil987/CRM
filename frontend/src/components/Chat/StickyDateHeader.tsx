import React, { useState, useRef, useEffect } from 'react';

interface StickyDateHeaderProps {
    label: string;
    onJumpTo: (action: 'yesterday' | 'beginning' | 'specific', date?: Date) => void;
}

export const StickyDateHeader: React.FC<StickyDateHeaderProps> = ({ label, onJumpTo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="absolute top-16 left-0 right-0 flex justify-center z-30 pointer-events-none">
            <div className="relative pointer-events-auto" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 rounded-full px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1 transition-all"
                >
                    {label}
                    <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-100 cursor-default">
                        <div className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Jump to date
                        </div>

                        <div className="space-y-2">
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => {
                                    if (e.target.valueAsDate) {
                                        onJumpTo('specific', e.target.valueAsDate);
                                        setIsOpen(false);
                                    }
                                }}
                            />

                            <div className="flex justify-between gap-2 pt-2 border-t border-gray-100 mt-2">
                                <button
                                    onClick={() => { onJumpTo('yesterday'); setIsOpen(false); }}
                                    className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Yesterday
                                </button>
                                <button
                                    onClick={() => { onJumpTo('beginning'); setIsOpen(false); }}
                                    className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Start
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
