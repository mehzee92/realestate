import React from 'react';
import Headings from './Headings';

const PropertyStats = ({ bedrooms, bathrooms, livingArea }) => {
  return (
    <div className="flex items-center m-auto border border-gray-400 rounded-md">
      {bedrooms && bedrooms > 0 && (
        <div className="flex flex-col items-center justify-center border-r border-gray-400 px-4">
          <Headings text={bedrooms} />
          <span className="text-2xl text-gray-700"> Beds</span>
        </div>
      )}

      {bathrooms && bathrooms > 0 && (
        <div className="flex flex-col items-center border-r justify-center border-gray-400 px-4">
          <Headings text={bathrooms} />
          <span className="text-2xl text-gray-700"> Baths</span>
        </div>
      )}

      {livingArea && livingArea > 0 && (
        <div className="flex flex-col items-center justify-center px-4">
          <Headings text={livingArea.toLocaleString()} />
          <span className=" text-2xl text-gray-700"> sqft</span>
        </div>
      )}
    </div>
  );
};

export default PropertyStats;