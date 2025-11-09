import H2 from '@/components/uis/h2';
import React from 'react';

const ListingTypeSwitch = ({ selectedListingType, setSelectedListingType }) => {
  return (
    <div>
      <H2 text="Listing Type" />

      <div className="flex w-full bg-[#f5f5f5] rounded-full p-1">
        <div
          className={`flex-1 text-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
            selectedListingType === 'For Sale' ? 'bg-white text-black' : 'text-black'
          }`}
          onClick={() => setSelectedListingType('For Sale')}
        >
          For sale
        </div>
        <div
          className={`flex-1 text-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
            selectedListingType === 'For Rent' ? 'bg-white text-black' : 'text-black'
          }`}
          onClick={() => setSelectedListingType('For Rent')}
        >
          For rent
        </div>
      </div>
    </div>
  );
};

export default ListingTypeSwitch;