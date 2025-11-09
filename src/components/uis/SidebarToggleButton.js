import React from 'react';
import { FaListUl } from "react-icons/fa6";

const SidebarToggleButton = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div className={`md:hidden w-10 h-fit z-30 transition-transform duration-300`}>
      <button onClick={toggleSidebar} className=' fixed left-[50%] translate-x-[-50%] bottom-20 w-fit border border-black border-l-0 flex justify-center items-center gap-2 h-fit  z-40  bg-black text-white p-2 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
        {sidebarOpen ? <>View Map</> :<><FaListUl /> View List</> }
      </button>
    </div>
  );
};

export default SidebarToggleButton;