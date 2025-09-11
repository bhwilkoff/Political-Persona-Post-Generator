
import React from 'react';
import { POLITICAL_VIEWPOINTS } from '../constants';

interface GeneratorFormProps {
  url: string;
  setUrl: (url: string) => void;
  selectedViewpointId: string;
  setSelectedViewpointId: (id: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  url,
  setUrl,
  selectedViewpointId,
  setSelectedViewpointId,
  isLoading,
  onGenerate,
}) => {
  const selectedViewpoint = POLITICAL_VIEWPOINTS.find(v => v.id === selectedViewpointId);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-2">
            Article URL
          </label>
          <input
            type="url"
            id="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/news-article"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="viewpoint-select" className="block text-sm font-medium text-gray-300 mb-2">
            Political Viewpoint
          </label>
          <select
            id="viewpoint-select"
            value={selectedViewpointId}
            onChange={(e) => setSelectedViewpointId(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {POLITICAL_VIEWPOINTS.map((viewpoint) => (
              <option key={viewpoint.id} value={viewpoint.id}>
                {viewpoint.name}
              </option>
            ))}
          </select>
        </div>
      </div>
       {selectedViewpoint && (
          <p className="text-sm text-gray-400 mt-3 text-center md:text-left">
              <strong>Perspective:</strong> {selectedViewpoint.description}
          </p>
       )}
      <div className="mt-6 text-center">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Post'
          )}
        </button>
      </div>
    </div>
  );
};
