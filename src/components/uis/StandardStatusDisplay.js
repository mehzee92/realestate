import React from 'react';

const StandardStatusDisplay = ({ status }) => {
  return (
    <div className="bg-blue-50 p-2 w-fit rounded-lg">
      <div className="flex justify-between font-medium items-center gap-3">
        Standard Status :<span className="text-blue-700 font-medium"> {status}</span>
      </div>
    </div>
  );
};

export default StandardStatusDisplay;