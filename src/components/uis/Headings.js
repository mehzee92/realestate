import React from 'react';

const Headings = ({ text , className }) => {

  return (
    <h2 className={`font-bold text-2xl text-gray-900 ${className}`}>
      {text}
    </h2>
  );
};

export default Headings;
