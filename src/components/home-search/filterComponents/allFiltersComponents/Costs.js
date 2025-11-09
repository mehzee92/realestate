'use client';
import React, { useState } from 'react';
import Button from '../../../uis/Button';
import H2 from '@/components/uis/h2';

const Costs = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = ['All', 'Yes', 'No'];

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <H2 text="Costs" />
        
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="px-4 pt-4 pb-4 relative z-[9998]">
            <h4 className="font-medium text-gray-900 mb-3">Association fee</h4>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <Button
                  varient="secondary"
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`md:px-4 py-2 rounded-md font-medium ${
                    selected === option
                      ? 'bg-[#e5e5e5] text-blue-600 hover:bg-[#d5d5d5]'
                      : 'bg-[#f5f5f5] text-black hover:bg-[#e5e5e5]'
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Costs;
