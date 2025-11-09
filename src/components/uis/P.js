import React from 'react';

const P = ({ text, className }) => {
  return (
    <p className={`text-base text-gray-800 ${className}`}>
      {text}
    </p>
  );
};

export default P;