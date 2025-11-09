import React from 'react';

const PricePerSqft = ({ pricePerSqft }) => {
  if (!pricePerSqft || isNaN(pricePerSqft)) return null;
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          focusable="false"
          role="img"
          className="w-5 h-4"><g stroke="none"><path d="M29 21H11V3a1.003 1.003 0 00-1-1H3a1.003 1.003 0 00-1 1v26a1.003 1.003 0 001 1h26a1.003 1.003 0 001-1v-7a1.003 1.003 0 00-1-1zm-1 7H4V4h5v2H8a1 1 0 000 2h1v3H8a1 1 0 000 2h1v3H8a1 1 0 000 2h1v5h5v1a1 1 0 002 0v-1h3v1a1 1 0 002 0v-1h3v1a1 1 0 002 0v-1h2z"></path><path d="M20.038 14.587a2.882 2.882 0 01-1.947-.831 1.347 1.347 0 00-.926-.419.802.802 0 00-.865.825 1.578 1.578 0 00.595 1.141 4.027 4.027 0 002.19.883v.885a.929.929 0 001.858 0v-.913a2.949 2.949 0 002.757-2.875c0-1.385-.838-2.23-2.54-2.562l-1.278-.263c-.858-.17-1.25-.494-1.25-1 0-.568.506-1.02 1.303-1.02a2.31 2.31 0 011.737.763 1.414 1.414 0 00.98.419.751.751 0 00.777-.757 1.622 1.622 0 00-.58-1.136 3.7 3.7 0 00-1.907-.856v-.943a.929.929 0 00-1.857 0v.927a2.834 2.834 0 00-2.67 2.772c0 1.378.824 2.257 2.46 2.595l1.27.277c.974.21 1.359.507 1.359 1.014 0 .649-.514 1.074-1.466 1.074z"></path></g></svg>
        <span className="text-gray-700">${pricePerSqft}/sqft</span>
      </div>
    </div>
  );
};

export default PricePerSqft;