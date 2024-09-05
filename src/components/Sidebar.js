"use client";
import React from "react";

const Sidebar = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <div className="bg-[#8b0038] text-white p-4 rounded-lg shadow-lg w-full lg:w-72 h-auto overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-center"></h3>
      <ul className="flex flex-col space-y-4">
        {options.map((option, index) => (
          <li
            key={index}
            className={`flex items-center p-4 cursor-pointer text-sm rounded-md transition-all duration-200 border-b border-gray-700 ${
              selectedOption === option.name ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setSelectedOption(option.name)}
          >
            <img 
              src={`/images/${option.icon}`} 
              alt={option.name} 
              className="h-8 w-8 mr-4 object-cover" 
            />
            <span className="text-lg font-medium">{option.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
