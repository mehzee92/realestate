import React from 'react';

const NotFoundDisplay = ({ message = "Property not found", title = "Property not found" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-gray-600 text-lg">{title}</p>
      {message && message !== title && <p className="text-gray-600 mt-2">{message}</p>}
    </div>
  );
};

export default NotFoundDisplay;