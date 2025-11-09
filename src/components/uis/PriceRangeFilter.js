import React from 'react';
import Input from '../uis/Input';
import DropdownButton from '../home-search/filterComponents/DropdownButton';

const PriceRangeFilter = ({ 
    priceRange, 
    isOpen, 
    onToggle, 
    onPriceChange, 
    onMinPriceInput, 
    onMaxPriceInput, 
    formatPrice,
    getPriceRangeText
}) => {
    return (
        <div className='md:relative'>
            <DropdownButton
                isOpen={isOpen}
                onClick={onToggle}
            >
                {getPriceRangeText()}
            </DropdownButton>
            {isOpen && (
                <div className='absolute top-[110%] left-0 border border-gray-200 shadow-lg rounded-xl bg-white z-[100] p-2 w-[400px]'>
                    <div className='flex w-fit items-center gap-3 mb-4'>
                        <Input
                            type="text"
                            value={formatPrice(priceRange[0])}
                            onChange={onMinPriceInput}
                        />
                        <span className='text-gray-500 text-sm'>to</span>
                        <Input
                            type="text"
                            value={formatPrice(priceRange[1])}
                            onChange={onMaxPriceInput}
                        />
                    </div>
                    {/* Dual Range Slider */}
                    <div className='range-slider mt-4 relative'>
                        <style jsx>{`
                            .range-slider {
                                position: relative;
                                height: 24px;
                            }

                            .range-input {
                                position: absolute;
                                width: 100%;
                                height: 24px;
                                top: 0;
                                left: 0;
                                -webkit-appearance: none;
                                appearance: none;
                                background: transparent;
                                cursor: pointer;
                                pointer-events: none;
                            }

                            .range-input::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                appearance: none;
                                height: 16px;
                                width: 16px;
                                border-radius: 50%;
                                background: #374151;
                                cursor: pointer;
                                pointer-events: auto;
                                border: 2px solid white;
                                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                            }

                            .range-input::-moz-range-thumb {
                                height: 16px;
                                width: 16px;
                                border-radius: 50%;
                                background: #374151;
                                cursor: pointer;
                                pointer-events: auto;
                                border: 2px solid white;
                                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                            }

                            .range-input.range-min {
                                z-index: 1;
                            }

                            .range-input.range-max {
                                z-index: 2;
                            }
                        `}</style>
                        {/* Track */}
                        <div className='absolute top-2 w-full h-2 bg-gray-200 rounded-full' />
                        {/* Active Range */}
                        <div
                            className='absolute top-2 h-2 bg-gray-500 rounded-full'
                            style={{
                                left: `${(priceRange[0] / 20000000) * 100}%`,
                                width: `${((priceRange[1] - priceRange[0]) / 20000000) * 100}%`,
                            }}
                        />
                        {/* Min Range Input */}
                        <input
                            type='range'
                            min='0'
                            max='20000000'
                            step='10000'
                            value={priceRange[0]}
                            onChange={(e) => {
                                const value = Math.min(parseInt(e.target.value), priceRange[1] - 10000);
                                onPriceChange([value, priceRange[1]]);
                            }}
                            className='range-input range-min'
                        />
                        {/* Max Range Input */}
                        <input
                            type='range'
                            min='0'
                            max='20000000'
                            step='10000'
                            value={priceRange[1]}
                            onChange={(e) => {
                                const value = Math.max(parseInt(e.target.value), priceRange[0] + 10000);
                                onPriceChange([priceRange[0], value]);
                            }}
                            className='range-input range-max'
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceRangeFilter;