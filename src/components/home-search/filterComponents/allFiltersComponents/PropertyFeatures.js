import H2 from '@/components/uis/h2';
import Input from '@/components/uis/Input';
import React, { useState } from 'react';

const FEATURES = [
  'A/C',
  'Basement',
  'Fireplace',
  'Garage',
  'Heater',
  'Pets Allowed',
  'Pool',
  'View',
  'Waterfront',
];

const PropertyFeatures = ({ selectedFeatures, setSelectedFeatures, keyword, setKeyword }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFeature = (feature) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(newFeatures);
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <H2 text="Property features" />
         
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
          <div className="pb-6 relative z-[9998]">
            {/* Features List */}
            <div className="mt-4 space-y-3">
              {FEATURES.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="text-sm text-black">{feature}</span>
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-black border-gray-300 rounded"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                </label>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Keyword search</h4>
              <Input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Try "office" or "pool"...'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFeatures;
