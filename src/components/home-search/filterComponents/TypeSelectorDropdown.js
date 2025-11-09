'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from '../../uis/Button';

export default function TypeSelectorDropdown({
  isOpen,
  setIsOpen,
  selectedType,
  setSelectedType,
  forwardedRef,
}) {
  const dropdownRef = useRef(null);
  const [positionRight, setPositionRight] = useState(false);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setIsOpen(false);
  };

  // Adjust dropdown if it overflows the screen on small viewports
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const overflowRight = rect.right > window.innerWidth;

      setPositionRight(overflowRight);
    }
  }, [isOpen]);

  return (
    <div className='relative z-50' ref={forwardedRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-white px-2 py-[5px] cursor-pointer border border-gray-200 rounded-md hover:bg-[#ededed]'
      >
        {selectedType}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute top-[110%] w-[300px] border border-gray-200 shadow-sm rounded-xl bg-white z-50 ${
            positionRight ? 'right-0 left-auto' : 'left-0'
          }`}
        >
          {['For Sale', 'For Rent'].map((type) => (
            <div
              key={type}
              className={`flex items-center w-full justify-between p-4 gap-2 cursor-pointer ${
                selectedType === type ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleTypeSelect(type)}
            >
              <label htmlFor={type}>{type}</label>
              <input
                type='radio'
                id={type}
                name='propertyType'
                checked={selectedType === type}
                readOnly
                className='w-4 h-4'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
