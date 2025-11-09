import React from 'react';

const IconCard = ({ icon: Icon, text, size = 24, className = "text-gray-500" }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center gap-2">
        {typeof Icon === 'function' ? <Icon size={size} className={className} /> : Icon}
        <span className="text-gray-700">{text}</span>
      </div>
    </div>
  );
};

export default IconCard;