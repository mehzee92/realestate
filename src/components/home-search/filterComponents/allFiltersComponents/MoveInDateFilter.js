import H2 from '@/components/uis/h2';
import React, { useState } from 'react';

const MoveInDateFilter = ({ 
  selectedDate, 
  setSelectedDate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Predefined date options
  const dateOptions = [
    { label: 'Any time', value: null },
    { label: 'Next 30 days', value: 'next30' },
    { label: 'Next 60 days', value: 'next60' },
    { label: 'Next 90 days', value: 'next90' },
    { label: 'Specific date', value: 'specific' }
  ];

  const handleDateOptionSelect = (option) => {
    if (option.value === 'specific') {
      setIsDatePickerOpen(true);
    } else {
      setSelectedDate(option.value);
      setIsDatePickerOpen(false);
    }
  };

  const handleSpecificDateSelect = (e) => {
    setSelectedDate(e.target.value);
    setIsDatePickerOpen(false);
  };

  const getDisplayValue = () => {
    if (!selectedDate) return 'Select';
    
    const option = dateOptions.find(opt => opt.value === selectedDate);
    if (option) return option.label;
    
    // If it's a specific date
    if (selectedDate && selectedDate !== 'next30' && selectedDate !== 'next60' && selectedDate !== 'next90') {
      return new Date(selectedDate).toLocaleDateString();
    }
    
    return 'Select';
  };

  return (
    <div className="w-full">
      {/* Move-in Date Accordion */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <H2 text="Move-in date" />
          
          <svg 
            className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="pb-4 relative z-[9998]">
            {/* Date Selector Dropdown */}
            <div className="relative mb-3">
              <select
                value={selectedDate || ''}
                onChange={(e) => {
                  const option = dateOptions.find(opt => opt.value === e.target.value || (opt.value === null && e.target.value === ''));
                  handleDateOptionSelect(option);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-black bg-white appearance-none cursor-pointer"
              >
                {dateOptions.map((option, index) => (
                  <option key={index} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Specific Date Picker (shown when "Specific date" is selected) */}
            {isDatePickerOpen && (
              <div className="mb-3">
                <input
                  type="date"
                  onChange={handleSpecificDateSelect}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-black"
                />
              </div>
            )}

            {/* Description Text */}
            <p className="text-xs text-gray-500 leading-relaxed">
              Move-in date refers to the date you select and any day before that. This filter only applies to rental properties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveInDateFilter;