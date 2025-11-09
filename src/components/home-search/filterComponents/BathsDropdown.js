'use client';

import React, { useRef, useEffect, useState } from 'react';
import Button from '../../uis/Button';

const bathOptions = [
  { label: 'Any', value: 'any' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5+', value: '5+' },
];

const BathsDropdown = ({ value = 'any', onChange, open, setOpen, className }) => {
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const selected = value;

  const handleSelect = (val) => {
    if (onChange) {
      if (val === 'any') {
        onChange('Any');
      } else {
        onChange(val);
      }
    }
    setOpen(false);
  };

  return (
    <div ref={containerRef} className='inline-block'>
      <Button
        onClick={() => setOpen(!open)}
        className='bg-white px-2 py-[5px] border cursor-pointer border-gray-200 rounded-md hover:bg-[#ededed] min-w-[80px]'
      >
        {selected === 'any'
          ? 'All baths'
          : bathOptions.find((o) => o.value === selected)?.label || 'All baths'}
      </Button>

      {open && (
        <div
          ref={dropdownRef}
          className={`flex bg-white border border-gray-200 rounded-xl shadow-lg p-2 gap-2 ${className}`}
        >
          {bathOptions.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`px-4 py-2 rounded-md md:w-[50px] font-medium transition-all ${
                selected === opt.value
                  ? 'bg-white text-blue-500 border-blue-200 hover:bg-blue-100'
                  : 'bg-[#f5f5f5] text-black hover:bg-[#e5e5e5]'
              }`}
              style={{ minWidth: 40 }}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BathsDropdown;
