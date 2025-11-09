import H2 from '@/components/uis/h2';
import React from 'react';

const PropertyTypesFilter = ({ allPropertyTypes, selectedPropertyTypes, handlePropertyTypeClick }) => {
  return (
    <div>
      <H2 text="Property Types" />
      
      <div className="flex flex-wrap gap-2">
        {allPropertyTypes.map((type) => (
          <div
            key={type.value}
            onClick={() => handlePropertyTypeClick(type.value)}
            className={`flex flex-col justify-center md:w-24 md:h-24 w-1/4 items-center gap-1 border rounded-md p-3 cursor-pointer ${
              selectedPropertyTypes.includes(type.value)
                ? 'text-blue-500 border-blue-500 hover:bg-blue-100'
                : 'border-gray-200 hover:border-black'
            }`}
          >
            {type.icon}
            <span className="text-xs">{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyTypesFilter;
