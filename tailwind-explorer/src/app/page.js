"use client";
import React, { useState, useCallback, useEffect } from 'react';

// Expanded data for class groups with descriptions
const classData = [
  {
    category: "Layout",
    classes: [
      { name: "container", description: "The container class sets the max-width of an element to match the min-width of the current breakpoint. This is useful for setting the maximum width of a design element relative to the viewport. It's centered by default with horizontal padding applied at smaller breakpoints." },
      { name: "box-border", description: "The box-border class sets an element's box-sizing to border-box, which tells the browser to include the element's borders and padding in the element's size calculation. This is Tailwind's default box-sizing model." },
      { name: "box-content", description: "The box-content class sets an element's box-sizing to content-box, meaning the browser excludes borders and padding from size calculations. This makes the actual rendered size larger than the specified width and height." },
      { name: "block", description: "The block class sets an element's display property to block. Block elements start on a new line and take up the full width available." },
      { name: "inline", description: "The inline class sets an element's display property to inline. Inline elements do not start on a new line and only take up as much width as necessary." },
      { name: "inline-block", description: "The inline-block class combines features of both inline and block elements. It flows with text (like inline) but can have width and height values (like block)." },
      { name: "flex", description: "The flex class sets an element's display property to flex, enabling a flex context for all its direct children. This is the foundation of flexbox layout in Tailwind." },
      { name: "grid", description: "The grid class sets an element's display property to grid, enabling CSS Grid layout for positioning its children. Grid provides two-dimensional control of layout (rows and columns)." },
      { name: "hidden", description: "The hidden class sets an element's display property to none, removing it from the layout flow and making it invisible. The element takes up no space when hidden." }
    ]
  },
  {
    category: "Spacing",
    classes: [
      { name: "m-0", description: "The m-0 class removes all margins from an element, setting margin to 0 on all sides (top, right, bottom, and left)." },
      { name: "m-1", description: "The m-1 class applies a small uniform margin (0.25rem or 4px by default) to all sides of an element." },
      { name: "m-2", description: "The m-2 class applies a uniform margin of 0.5rem (8px by default) to all sides of an element." },
      { name: "m-4", description: "The m-4 class applies a uniform margin to all sides (top, right, bottom, and left) of an element. By default, Tailwind's spacing scale is based on a 0.25rem interval, so the number 4 corresponds to 1rem. This means that using m-4 will add a 1rem margin around the element." },
      { name: "m-8", description: "The m-8 class applies a larger uniform margin of 2rem (32px by default) to all sides of an element." },
      { name: "p-0", description: "The p-0 class removes all padding from an element, setting padding to 0 on all sides." },
      { name: "p-1", description: "The p-1 class applies a small uniform padding (0.25rem or 4px by default) to all sides of an element." },
      { name: "p-2", description: "The p-2 class applies a uniform padding of 0.5rem (8px by default) to all sides of an element." },
      { name: "p-4", description: "The p-4 class applies a uniform padding of 1rem (16px by default) to all sides of an element." },
      { name: "p-8", description: "The p-8 class applies a larger uniform padding of 2rem (32px by default) to all sides of an element." },
      { name: "mx-auto", description: "The mx-auto class automatically centers an element horizontally within its container by setting both the left and right margins to auto. This is commonly used for container elements with a defined width." },
      { name: "my-2", description: "The my-2 class applies a vertical margin of 0.5rem (8px by default) to both the top and bottom of an element, while leaving horizontal margins unchanged." },
      { name: "px-4", description: "The px-4 class applies a horizontal padding of 1rem (16px by default) to both the left and right sides of an element, while leaving vertical padding unchanged." },
      { name: "py-2", description: "The py-2 class applies a vertical padding of 0.5rem (8px by default) to both the top and bottom of an element, while leaving horizontal padding unchanged." }
    ]
  },
  {
    category: "Typography",
    classes: [
      { name: "text-xs", description: "The text-xs class sets the font size to extra small (0.75rem or 12px by default)." },
      { name: "text-sm", description: "The text-sm class sets the font size to small (0.875rem or 14px by default)." },
      { name: "text-base", description: "The text-base class sets the font size to the base size (1rem or 16px by default)." },
      { name: "text-lg", description: "The text-lg class sets the font size to large (1.125rem or 18px by default)." },
      { name: "text-xl", description: "The text-xl class sets the font size to extra large (1.25rem or 20px by default)." },
      { name: "text-2xl", description: "The text-2xl class sets the font size to 1.5rem (24px by default), part of Tailwind's typographic scale." },
      { name: "font-light", description: "The font-light class sets the font weight to light (300 by default), creating thinner text." },
      { name: "font-normal", description: "The font-normal class sets the font weight to normal (400 by default), the standard weight for most text." },
      { name: "font-medium", description: "The font-medium class sets the font weight to medium (500 by default), slightly bolder than normal." },
      { name: "font-bold", description: "The font-bold class sets the font weight to bold (700 by default), creating more prominent text." },
      { name: "text-left", description: "The text-left class aligns text to the left side of its container." },
      { name: "text-center", description: "The text-center class centers text horizontally within its container." },
      { name: "text-right", description: "The text-right class aligns text to the right side of its container." },
      { name: "italic", description: "The italic class applies an italic style to text." },
      { name: "not-italic", description: "The not-italic class explicitly sets text to a normal (non-italic) style." },
      { name: "uppercase", description: "The uppercase class transforms all text to uppercase (capital letters)." },
      { name: "lowercase", description: "The lowercase class transforms all text to lowercase." },
      { name: "capitalize", description: "The capitalize class transforms the first letter of each word to uppercase." }
    ]
  },
  {
    category: "Colors",
    classes: [
      { name: "text-gray-500", description: "The text-gray-500 class sets the text color to a medium gray shade (a hex value like #6b7280 by default). The 500 value in Tailwind's color scale represents a medium intensity of the color." },
      { name: "text-blue-500", description: "The text-blue-500 class sets the text color to a medium blue shade (a hex value like #3b82f6 by default)." },
      { name: "text-red-500", description: "The text-red-500 class sets the text color to a medium red shade (a hex value like #ef4444 by default)." },
      { name: "text-green-500", description: "The text-green-500 class sets the text color to a medium green shade (a hex value like #10b981 by default)." },
      { name: "bg-white", description: "The bg-white class sets the background color of an element to white." },
      { name: "bg-gray-100", description: "The bg-gray-100 class sets the background color to a very light gray shade (a hex value like #f3f4f6 by default). The 100 value in Tailwind's scale represents a very light intensity." },
      { name: "bg-blue-100", description: "The bg-blue-100 class sets the background color to a very light blue shade (a hex value like #dbeafe by default)." },
      { name: "bg-red-100", description: "The bg-red-100 class sets the background color to a very light red shade (a hex value like #fee2e2 by default)." },
      { name: "bg-green-100", description: "The bg-green-100 class sets the background color to a very light green shade (a hex value like #d1fae5 by default)." }
    ]
  },
  {
    category: "Borders",
    classes: [
      { name: "border", description: "The border class adds a 1px solid border on all sides of an element. The default border color is determined by the theme's border-color value." },
      { name: "border-0", description: "The border-0 class explicitly sets the border width to 0, removing any borders from the element." },
      { name: "border-2", description: "The border-2 class sets the border width to 2px on all sides of an element." },
      { name: "border-4", description: "The border-4 class sets the border width to 4px on all sides of an element." },
      { name: "rounded", description: "The rounded class applies a border radius of 0.25rem (4px by default) to all corners of an element, creating slightly rounded corners." },
      { name: "rounded-sm", description: "The rounded-sm class applies a small border radius of 0.125rem (2px by default) to all corners of an element." },
      { name: "rounded-md", description: "The rounded-md class applies a medium border radius of 0.375rem (6px by default) to all corners of an element." },
      { name: "rounded-lg", description: "The rounded-lg class applies a larger border radius of 0.5rem (8px by default) to all corners of an element." },
      { name: "rounded-full", description: "The rounded-full class applies a border radius of 9999px to all corners of an element, creating a fully rounded shape (a circle for square elements, or a pill shape for rectangular elements)." },
      { name: "border-gray-200", description: "The border-gray-200 class sets the border color to a light gray shade (a hex value like #e5e7eb by default)." },
      { name: "border-blue-500", description: "The border-blue-500 class sets the border color to a medium blue shade (a hex value like #3b82f6 by default)." }
    ]
  },
  {
    category: "Flexbox",
    classes: [
      { name: "flex-row", description: "The flex-row class sets a flex container's direction to row, arranging flex items horizontally from left to right. This is the default flex direction." },
      { name: "flex-col", description: "The flex-col class sets a flex container's direction to column, arranging flex items vertically from top to bottom." },
      { name: "justify-start", description: "The justify-start class aligns flex items at the start of the container along the main axis (left for row, top for column)." },
      { name: "justify-center", description: "The justify-center class centers flex items along the main axis of the container." },
      { name: "justify-end", description: "The justify-end class aligns flex items at the end of the container along the main axis (right for row, bottom for column)." },
      { name: "justify-between", description: "The justify-between class distributes flex items evenly along the main axis, with the first item at the start and the last at the end." },
      { name: "items-start", description: "The items-start class aligns flex items at the start of the container along the cross axis (top for row, left for column)." },
      { name: "items-center", description: "The items-center class centers flex items along the cross axis of the container." },
      { name: "items-end", description: "The items-end class aligns flex items at the end of the container along the cross axis (bottom for row, right for column)." },
      { name: "items-stretch", description: "The items-stretch class stretches flex items to fill the container along the cross axis. This is the default behavior." },
      { name: "flex-wrap", description: "The flex-wrap class allows flex items to wrap onto multiple lines when they run out of space in the container." },
      { name: "flex-nowrap", description: "The flex-nowrap class prevents flex items from wrapping, keeping them on a single line even if they overflow the container." }
    ]
  },
  {
    category: "Grid",
    classes: [
      { name: "grid-cols-1", description: "The grid-cols-1 class creates a grid with 1 column." },
      { name: "grid-cols-2", description: "The grid-cols-2 class creates a grid with 2 equal-width columns." },
      { name: "grid-cols-3", description: "The grid-cols-3 class creates a grid with 3 equal-width columns." },
      { name: "grid-cols-4", description: "The grid-cols-4 class creates a grid with 4 equal-width columns." },
      { name: "gap-1", description: "The gap-1 class adds a small gap (0.25rem or 4px by default) between grid items, both horizontally and vertically." },
      { name: "gap-2", description: "The gap-2 class adds a gap of 0.5rem (8px by default) between grid items." },
      { name: "gap-4", description: "The gap-4 class adds a gap of 1rem (16px by default) between grid items." },
      { name: "gap-8", description: "The gap-8 class adds a larger gap of 2rem (32px by default) between grid items." }
    ]
  },
  {
    category: "Effects",
    classes: [
      { name: "shadow-sm", description: "The shadow-sm class applies a small box shadow to an element, giving it a subtle elevation effect." },
      { name: "shadow", description: "The shadow class applies a medium-sized box shadow to an element, creating a standard elevation effect." },
      { name: "shadow-md", description: "The shadow-md class applies a medium-large box shadow to an element, creating a more noticeable elevation effect." },
      { name: "shadow-lg", description: "The shadow-lg class applies a large box shadow to an element, creating a significant elevation effect." },
      { name: "shadow-xl", description: "The shadow-xl class applies an extra large box shadow to an element, creating a very prominent elevation effect." },
      { name: "opacity-50", description: "The opacity-50 class sets an element's opacity to 50%, making it semi-transparent." },
      { name: "opacity-75", description: "The opacity-75 class sets an element's opacity to 75%, making it slightly transparent." },
      { name: "opacity-100", description: "The opacity-100 class sets an element's opacity to 100%, making it fully opaque. This is useful for overriding other opacity classes in responsive designs." }
    ]
  }
];

// Tailwind description text
const tailwindDescription = `
Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. 
Instead of pre-designed components, Tailwind provides low-level utility classes that let you build completely custom designs. 
It's highly customizable, promotes consistent design systems, and reduces CSS bloat by only including the styles you actually use.
`;

// Sidebar Component with dropdown selects
function Sidebar({ onSelect }) {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="w-1/3 p-4 bg-white border-r border-gray-200 shadow-sm overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Tailwind Classes</h2>
      
      {classData.map(group => (
        <div key={group.category} className="mb-4">
          <button 
            onClick={() => toggleCategory(group.category)}
            className="w-full text-left text-xl font-semibold p-2 text-gray-700 bg-gray-50 rounded flex justify-between items-center hover:bg-gray-100 transition-colors"
          >
            {group.category}
            <span>{openCategory === group.category ? '−' : '+'}</span>
          </button>
          
          {openCategory === group.category && (
            <div className="mt-2 pl-2">
              <select 
                className="w-full p-2 border border-gray-200 rounded"
                onChange={(e) => onSelect(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select a class</option>
                {group.classes.map(cls => (
                  <option key={cls.name} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Preview Component: Showcases multiple elements with the selected class applied
function Preview({ selectedClass, classDetails }) {
  // Define initial code templates
  const initialMainCode = `<div class="p-6 bg-white border border-gray-200 rounded shadow transition-all duration-300">
  <!-- Header Section -->
  <header class="mb-4 p-2 bg-gray-100 rounded text-gray-700">Header Section</header>
  
  <!-- Flex Section with Buttons -->
  <div class="mb-4 flex space-x-2">
    <button class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors">
      Button 1
    </button>
    <button class="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors">
      Button 2
    </button>
    <button class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors">
      Button 3
    </button>
  </div>
  
  <!-- Grid Section with Cards -->
  <div class="grid grid-cols-2 gap-4">
    <div class="p-4 border border-gray-200 rounded shadow-sm bg-white">
      Card 1
    </div>
    <div class="p-4 border border-gray-200 rounded shadow-sm bg-white">
      Card 2
    </div>
    <div class="p-4 border border-gray-200 rounded shadow-sm bg-white">
      Card 3
    </div>
    <div class="p-4 border border-gray-200 rounded shadow-sm bg-white">
      Card 4
    </div>
  </div>
</div>`;

  // State for editable code and custom classes
  const [codeValue, setCodeValue] = useState(initialMainCode);
  const [customClasses, setCustomClasses] = useState("");
  const [previewHTML, setPreviewHTML] = useState(initialMainCode);

  // Function to apply selected class to code - wrapped in useCallback
  const applySelectedClass = useCallback(() => {
    if (selectedClass) {
      if (customClasses.includes(selectedClass)) {
        return; // Class is already added
      }
      const newCustomClasses = customClasses ? `${customClasses} ${selectedClass}` : selectedClass;
      setCustomClasses(newCustomClasses);
    }
  }, [selectedClass, customClasses]);

  // Function to update code and save changes
  const updatePreview = () => {
    setPreviewHTML(codeValue);
  };

  // Effect to apply the selected class when it changes
  useEffect(() => {
    if (selectedClass) {
      applySelectedClass();
    }
  }, [selectedClass, applySelectedClass]);

  // Insert custom classes into the first div in the HTML
  const displayHTML = previewHTML.replace(
    '<div class="', 
    `<div class="${customClasses ? customClasses + ' ' : ''}`
  );

  return (
    <div className="w-2/3 p-4 bg-gray-50 overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Preview</h2>
      
      <div className="mb-6 p-6 bg-white border border-gray-200 rounded shadow">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          {classDetails ? `Class: ${classDetails.name}` : "About Tailwind CSS"}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {classDetails ? classDetails.description : tailwindDescription}
        </p>
      </div>
      
      {/* Live Preview Area */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-700">Live Preview</h3>
          <div className="bg-gray-100 px-4 py-1 rounded text-sm font-mono text-gray-700 overflow-x-auto">
            {customClasses || "No classes applied"}
          </div>
        </div>
        <div 
          dangerouslySetInnerHTML={{ __html: displayHTML }} 
          className="preview-container"
        />
      </div>
      
      {/* Code Panel */}
      <div className="mb-4" id="code-panel">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">HTML Code</h3>
        <div className="relative">
          <textarea 
            className="w-full h-64 bg-gray-900 text-gray-100 font-mono p-4 rounded leading-normal text-sm"
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            onFocus={() => {
              // Scroll to the bottom of the code panel section
              setTimeout(() => {
                window.scrollTo({
                  top: document.getElementById('code-panel-buttons').offsetTop,
                  behavior: 'smooth'
                });
              }, 100);
            }}
          />
          <div className="flex justify-between mt-2" id="code-panel-buttons">
            <div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2"
                onClick={updatePreview}
              >
                Save Changes
              </button>
              <button 
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => {
                  setCodeValue(initialMainCode);
                  setCustomClasses("");
                  setPreviewHTML(initialMainCode);
                }}
              >
                Reset
              </button>
            </div>
            <div>
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={applySelectedClass}
                disabled={!selectedClass}
              >
                Apply Selected Class
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function Home() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    
    // Find the class description
    for (const category of classData) {
      const classInfo = category.classes.find(cls => cls.name === className);
      if (classInfo) {
        setSelectedClassDetails(classInfo);
        return;
      }
    }
    
    setSelectedClassDetails(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar onSelect={handleClassSelect} />
      <Preview selectedClass={selectedClass} classDetails={selectedClassDetails} />
    </div>
  );
}
