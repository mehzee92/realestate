import React from 'react';

const ErrorDisplay = ({ message, title = "Error loading property" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-red-600 text-lg">{title}</p>
      <p className="text-gray-600 mt-2">{message}</p>
    </div>
  );
};

export default ErrorDisplay;