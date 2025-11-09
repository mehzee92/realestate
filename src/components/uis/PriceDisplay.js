import React from 'react';
import Headings from './Headings';

const PriceDisplay = ({ price }) => {
  return (
    <div className="text-4xl font-bold text-gray-900">
      <span className='font-normal text-3xl'>Price</span> <span className='text-red-500'>$ {" "}</span>
      {price ? `${Number(price).toLocaleString()}` : 'Price not available'}
    </div>
  );
};

export default PriceDisplay;