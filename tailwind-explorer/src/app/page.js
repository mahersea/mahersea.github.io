"use client";
import React, { useState } from 'react';

// Sample data for class groups
const classData = [
  {
    category: "Layout",
    classes: ["container", "box-border", "box-content"],
  },
  {
    category: "Spacing",
    classes: ["m-4", "p-4"],
  },
  {
    category: "Typography",
    classes: ["text-lg", "font-bold"],
  },
  // Add more categories and classes as needed
];

// Sidebar Component: Lists grouped classes and handles selection
function Sidebar({ onSelect }) {
  return (
    <div className="w-1/3 p-4 bg-white border-r border-gray-200 shadow-sm overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Tailwind Classes</h2>
      {classData.map(group => (
        <div key={group.category} className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">{group.category}</h3>
          <ul>
            {group.classes.map(cls => (
              <li
                key={cls}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                onClick={() => onSelect(cls)}
              >
                {cls}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Preview Component: Showcases multiple elements with the selected class applied
function Preview({ selectedClass }) {
  return (
    <div className="w-2/3 p-4 bg-gray-50 overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Preview</h2>
      <div className={`p-6 bg-white border border-gray-200 rounded shadow transition-all duration-300 ${selectedClass}`}>
        {/* Header Section */}
        <header className="mb-4 p-2 bg-gray-100 rounded text-gray-700">Header Section</header>
        
        {/* Flex Section with Buttons */}
        <div className="mb-4 flex space-x-2">
          <button className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors ${selectedClass}`}>
            Button 1
          </button>
          <button className={`px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors ${selectedClass}`}>
            Button 2
          </button>
          <button className={`px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors ${selectedClass}`}>
            Button 3
          </button>
        </div>
        
        {/* Grid Section with Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 border border-gray-200 rounded shadow-sm bg-white ${selectedClass}`}>
            Card 1
          </div>
          <div className={`p-4 border border-gray-200 rounded shadow-sm bg-white ${selectedClass}`}>
            Card 2
          </div>
          <div className={`p-4 border border-gray-200 rounded shadow-sm bg-white ${selectedClass}`}>
            Card 3
          </div>
          <div className={`p-4 border border-gray-200 rounded shadow-sm bg-white ${selectedClass}`}>
            Card 4
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function Home() {
  const [selectedClass, setSelectedClass] = useState("");

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar onSelect={(cls) => setSelectedClass(cls)} />
      <Preview selectedClass={selectedClass} />
    </div>
  );
}
