import React from 'react';
import Button from '../../uis/Button';

const DropdownButton = ({ children, isOpen, onClick, className = '', ...props }) => (
    <Button
        onClick={onClick}
        className={`px-2 py-[5px] border cursor-pointer border-gray-200 rounded-md transition-all bg-white hover:bg-[#ededed] ${className}`}
        {...props}
    >
        {children}
    </Button>
);

export default DropdownButton;