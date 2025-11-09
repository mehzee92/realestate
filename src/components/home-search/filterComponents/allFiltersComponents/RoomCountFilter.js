import React from 'react';
import Button from '../../../uis/Button';
import H2 from '@/components/uis/h2';

const RoomCountFilter = ({ title, labels, selectedValue, setSelectedValue }) => {
  return (
    <div>
      <H2 text={title} />
      <div className="flex gap-2">
        {labels.map((label) => (
          <Button
            key={label}
            onClick={() => setSelectedValue(label)}
            className={`md:px-4 py-2 rounded-md font-medium ${
              selectedValue === label
                ? 'bg-[#e5e5e5] text-blue-600 hover:bg-[#d5d5d5]'
                : 'bg-[#f5f5f5] text-black hover:bg-[#e5e5e5]'
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RoomCountFilter;