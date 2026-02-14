import React from 'react';

interface DateSeparatorProps {
    label: string;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => {
    return (
        <div className="flex items-center justify-center my-6">
            <div className="h-px bg-gray-200 flex-1 mx-4"></div>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 rounded-full border border-gray-100">
                {label}
            </span>
            <div className="h-px bg-gray-200 flex-1 mx-4"></div>
        </div>
    );
};
