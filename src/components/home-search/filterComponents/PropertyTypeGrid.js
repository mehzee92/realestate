import React from 'react';
import Button from '../../uis/Button';

const PropertyTypeGrid = ({ allPropertyTypes, onTypeClick, selectedType }) => (
    <div className='grid grid-cols-3 absolute left-1/2 translate-x-[-50%] md:translate-x-0 w-[90%] md:top-[110%] md:left-0 border md:w-[300px] border-gray-200 shadow-lg rounded-xl bg-white z-50 p-3 gap-2'>
        {allPropertyTypes.map((type) => (
            <Button
                key={type.value}
                onClick={() => onTypeClick && onTypeClick(type.value)}
                className={`flex flex-col justify-center h-20 w-20 cursor-pointer items-center aspect-square p-2 rounded-md ${
                    selectedType === type.value
                        ? 'bg-blue-50 text-blue-500 border border-blue-200'
                        : 'bg-gray-50 text-black hover:bg-gray-100'
                }`}
            >
                <div className="flex items-center justify-center text-xl mb-1">
                    {type.icon}
                </div>
                <span className='text-xs text-center leading-tight'>
                    {type.name}
                </span>
            </Button>
        ))}
    </div>
);

export default PropertyTypeGrid;
