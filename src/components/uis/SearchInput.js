import React from 'react';

const SearchInput = ({ value, onChange, placeholder,className }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} border border-gray-300 w-full bg-white rounded-md px-3 py-[5px] outline-0 shadow-sm` }
    />
);

export default SearchInput;