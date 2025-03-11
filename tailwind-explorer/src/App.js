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
    <div className="w-1/3 border-r p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Tailwind Classes</h2>
      {classData.map(group => (
        <div key={group.category} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{group.category}</h3>
          <ul>
            {group.classes.map(cls => (
              <li
                key={cls}
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
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

// Preview Component: Shows a sample element with the selected class applied
function Preview({ selectedClass }) {
  return (
    <div className="w-2/3 p-4">
      <h2 className="text-2xl font-bold mb-4">Preview</h2>
      <div className={`p-6 border rounded transition-all duration-300 ${selectedClass}`}>
        <p className="mb-4">
          This is an example text. The selected class is:{" "}
          <strong>{selectedClass || "None"}</strong>.
        </p>
        <button className={`px-4 py-2 rounded ${selectedClass || "bg-blue-500 text-white"}`}>
          Button Example
        </button>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [selectedClass, setSelectedClass] = useState("");

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={(cls) => setSelectedClass(cls)} />
      <Preview selectedClass={selectedClass} />
    </div>
  );
}

export default App;
