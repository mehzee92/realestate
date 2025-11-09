import React from 'react';

const Button = ({ children, onClick, className, disabled, ...props }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center text-xs h-9 px-1 border rounded-md transition-colors duration-200
        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-[#ededed] cursor-pointer'}
        ${className}`}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>
);

export default Button;
