import H2 from '@/components/uis/h2';
import Input from '@/components/uis/Input';
import React, { useState, useCallback } from 'react';

const RangeSlider = ({
  range,
  setRange,
  min,
  max,
  step,
  formatValue,
  placeholderMin = 'No min',
  placeholderMax = 'No max',
}) => {
  const handleMinInput = useCallback(
    (e) => {
      const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || min;
      const clamped = Math.min(value, range[1] - step);
      setRange([clamped, range[1]]);
    },
    [range, setRange, min, step]
  );

  const handleMaxInput = useCallback(
    (e) => {
      const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || max;
      const clamped = Math.max(value, range[0] + step);
      setRange([range[0], clamped]);
    },
    [range, setRange, max, step]
  );

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Input
          type="text"
          value={range[0] === min ? '' : formatValue(range[0])}
          onChange={handleMinInput}
          placeholder={placeholderMin}
        />
        <span className="text-gray-500 text-sm">to</span>
        <Input
          type="text"
          value={range[1] === max ? '' : formatValue(range[1])}
          onChange={handleMaxInput}
          placeholder={placeholderMax}
        />
      </div>

      {/* Slider container */}
      <div className="relative h-6">
        <div className="absolute top-2 w-full h-2 bg-gray-200 rounded-full" />

        {/* Active range */}
        <div
          className="absolute top-2 h-2 bg-black rounded-full"
          style={{
            left: `${((range[0] - min) / (max - min)) * 100}%`,
            width: `${((range[1] - range[0]) / (max - min)) * 100}%`,
          }}
        />

        {/* Style slider input */}
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
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            pointer-events: auto;
          }

          .range-input::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: black;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            cursor: pointer;
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

        {/* Range sliders */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[0]}
          onChange={(e) =>
            setRange([Math.min(parseFloat(e.target.value), range[1] - step), range[1]])
          }
          className="range-input range-min"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[1]}
          onChange={(e) =>
            setRange([range[0], Math.max(parseFloat(e.target.value), range[0] + step)])
          }
          className="range-input range-max"
        />
      </div>
    </div>
  );
};

const PropertyDetailsFilter = ({
  squareFeetRange = [0, 10000],
  setSquareFeetRange,
  lotSizeRange = [0, 50],
  setLotSizeRange,
  yearBuiltRange = [1900, 2024],
  setYearBuiltRange,
  garageSpaces = 0,
  setGarageSpaces,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatSquareFeet = (value) => value.toLocaleString();
  const formatAcres = (value) => value.toFixed(1);
  const formatYear = (value) => value.toString();

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <H2 text="Property details" />
          
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
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Square feet</h4>
              <RangeSlider
                range={squareFeetRange}
                setRange={setSquareFeetRange}
                min={0}
                max={10000}
                step={100}
                formatValue={formatSquareFeet}
                placeholderMin="200"
                placeholderMax="No max"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Lot size (acres)</h4>
              <RangeSlider
                range={lotSizeRange}
                setRange={setLotSizeRange}
                min={0}
                max={50}
                step={0.1}
                formatValue={formatAcres}
                placeholderMin="No min"
                placeholderMax="19.8"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Year built</h4>
              <RangeSlider
                range={yearBuiltRange}
                setRange={setYearBuiltRange}
                min={1900}
                max={2024}
                step={1}
                formatValue={formatYear}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Garage spaces</h4>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, '5+'].map((spaces) => (
                  <button
                    key={spaces}
                    onClick={() => setGarageSpaces(spaces)}
                    className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                      garageSpaces === spaces
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {spaces === 0 ? 'Any' : spaces}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailsFilter;
