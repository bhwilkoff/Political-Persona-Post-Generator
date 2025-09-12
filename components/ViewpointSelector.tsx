import React, { useState, useRef, useEffect } from 'react';
import { POLITICAL_VIEWPOINTS } from '../constants';

interface ViewpointSelectorProps {
  selectedViewpointId: string;
  setSelectedViewpointId: (id: string) => void;
  isLoading: boolean;
}

export const ViewpointSelector: React.FC<ViewpointSelectorProps> = ({
  selectedViewpointId,
  setSelectedViewpointId,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedViewpoint = POLITICAL_VIEWPOINTS.find(v => v.id === selectedViewpointId) || POLITICAL_VIEWPOINTS[0];

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (viewpointId: string) => {
    setSelectedViewpointId(viewpointId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isLoading}
          className="inline-flex justify-between items-center w-full rounded-md border border-gray-600 shadow-sm px-3 py-2 bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {selectedViewpoint.name}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {POLITICAL_VIEWPOINTS.map((viewpoint) => (
              <button
                key={viewpoint.id}
                onClick={() => handleSelect(viewpoint.id)}
                className="text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-gray-600 hover:text-white"
                role="menuitem"
              >
                {viewpoint.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};