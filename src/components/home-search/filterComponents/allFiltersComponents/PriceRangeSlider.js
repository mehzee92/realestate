import H2 from '@/components/uis/h2';
import Input from '@/components/uis/Input';
import React, { useCallback } from 'react';

const PriceRangeSlider = ({ priceRange, setPriceRange }) => {
  const [minPrice, maxPrice] = priceRange;

  const formatPrice = useCallback((price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    return `${(price / 1000).toFixed(0)}K`;
  }, []);

  const handleMinPriceInput = useCallback((e) => {
    const inputValue = e.target.value.replace(/[$MK]/g, '').replace(/\./g, '');
    let value = parseInt(inputValue) || 0;
    
    // Convert based on suffix
    if (e.target.value.includes('M')) {
      value = value * 1000000;
    } else if (e.target.value.includes('K')) {
      value = value * 1000;
    }
    
    value = Math.min(value, maxPrice - 10000);
    setPriceRange([value, maxPrice]);
  }, [maxPrice, setPriceRange]);

  const handleMaxPriceInput = useCallback((e) => {
    const inputValue = e.target.value.replace(/[$MK]/g, '').replace(/\./g, '');
    let value = parseInt(inputValue) || 0;
    
    // Convert based on suffix
    if (e.target.value.includes('M')) {
      value = value * 1000000;
    } else if (e.target.value.includes('K')) {
      value = value * 1000;
    }
    
    value = Math.max(value, minPrice + 10000);
    setPriceRange([minPrice, value]);
  }, [minPrice, setPriceRange]);

  const handlePriceChange = useCallback((newRange) => {
    setPriceRange(newRange);
  }, [setPriceRange]);

  return (
    <div className='w-full mx-auto'>
      <H2 text="Price Range" />
      <div className='flex items-center gap-3 mb-4'>
        <Input
          type="text"
          value={formatPrice(minPrice)}
          onChange={handleMinPriceInput}
        />
        <span className='text-gray-500 text-sm'>to</span>
        <Input
          type="text"
          value={formatPrice(maxPrice)}
          onChange={handleMaxPriceInput}
        />
      </div>
      {/* Fixed Dual Range Slider */}
      <div className='range-slider mt-4 relative h-6'>
        {/* Track */}
        <div className='absolute top-2 w-full h-2 bg-gray-200 rounded-full' />
        {/* Active Range */}
        <div
          className='absolute top-2 h-2 bg-black rounded-full'
          style={{
            left: `${(minPrice / 20000000) * 100}%`,
            width: `${((maxPrice - minPrice) / 20000000) * 100}%`,
          }}
        />
        
        {/* Range Input Styles */}
        <style jsx>{`
          .range-input {
            position: absolute;
            height: 24px;
            background: transparent;
            -webkit-appearance: none;
            appearance: none;
            outline: none;
            cursor: pointer;
            top: 0;
            pointer-events: none;
          }
          
          .range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: black;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            pointer-events: auto;
          }
          
          .range-input::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: black;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            border: none;
            pointer-events: auto;
          }
          
          .range-input::-webkit-slider-track {
            background: transparent;
            height: 2px;
          }
          
          .range-input::-moz-range-track {
            background: transparent;
            border: none;
            height: 2px;
          }
          
          .range-min {
            width: 100%;
            left: 0;
            z-index: 1;
          }
          
          .range-max {
            width: 100%;
            left: 0;
            z-index: 2;
          }
        `}</style>
        
        {/* Min Range Input */}
        <input
          type='range'
          min='0'
          max='20000000'
          step='10000'
          value={minPrice}
          onChange={(e) => {
            const value = Math.min(parseInt(e.target.value), maxPrice - 10000);
            handlePriceChange([value, maxPrice]);
          }}
          className='range-input range-min'
        />
        {/* Max Range Input */}
        <input
          type='range'
          min='0'
          max='20000000'
          step='10000'
          value={maxPrice}
          onChange={(e) => {
            const value = Math.max(parseInt(e.target.value), minPrice + 10000);
            handlePriceChange([minPrice, value]);
          }}
          className='range-input range-max'
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;