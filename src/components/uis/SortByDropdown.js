import React from 'react';
import { HiChevronDown } from 'react-icons/hi';

const SortByDropdown = ({ sortBy, setSortBy }) => {
  return (
    <div className="flex items-center space-x-1">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="text-xs md:text-sm text-gray-700 border-none bg-transparent focus:outline-none cursor-pointer"
      >
        <option>Newest</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Square Feet</option>
      </select>
    </div>
  );
};

export default SortByDropdown;