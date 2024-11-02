// src/components/SectionSeparator.js
import React from 'react';

function SectionSeparator({ text }) {
    return (
        <div className="section-separator py-12 text-center flex items-center justify-center">
            {/* Animated line on the left */}
            <div className="flex-grow mx-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300 dark:via-gray-600 dark:to-gray-600 animate-pulse"></div>
            
            {/* Center text with a decorative background */}
            {text && (
                <p className="mx-4 px-3 py-1 text-lg font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-md shadow-md">
                    {text}
                </p>
            )}
            
            {/* Animated line on the right */}
            <div className="flex-grow mx-4 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300 dark:via-gray-600 dark:to-gray-600 animate-pulse"></div>
        </div>
    );
}

export default SectionSeparator;
