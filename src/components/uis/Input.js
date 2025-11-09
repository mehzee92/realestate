import React from 'react';

const Input = ({ className, value, onChange, placeholder, type = 'text', name, required = false, min, max, step, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      required={required}
      min={min}
      max={max}
      step={step}
      className={`${className} border w-full border-gray-300 rounded-md px-3 py-2 text-base outline-none`}
      {...props}
    />
  );
};

export default Input;