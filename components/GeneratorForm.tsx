import React from 'react';
import { POLITICAL_VIEWPOINTS } from '../constants';
import { TopStoryFetcher } from './TopStoryFetcher';
import { ViewpointSelector } from './ViewpointSelector';

interface GeneratorFormProps {
  url: string;
  setUrl: (url: string) => void;
  contextText: string;
  setContextText: (text: string) => void;
  contextImageFile: File | null;
  setContextImageFile: (file: File | null) => void;
  selectedViewpointId: string;
  setSelectedViewpointId: (id: string) => void;
  isLoading: boolean;
  isFetchingStory: boolean;
  needsManualContext: boolean;
  onGenerate: () => void;
  onFetchStory: (rssUrl: string) => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  url,
  setUrl,
  contextText,
  setContextText,
  contextImageFile,
  setContextImageFile,
  selectedViewpointId,
  setSelectedViewpointId,
  isLoading,
  isFetchingStory,
  needsManualContext,
  onGenerate,
  onFetchStory
}) => {
  const selectedViewpoint = POLITICAL_VIEWPOINTS.find(v => v.id === selectedViewpointId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContextImageFile(e.target.files[0]);
    } else {
      setContextImageFile(null);
    }
  };


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="flex items-end gap-2">
           <div className="flex-grow">
              <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-2">
                Article or Social Media URL
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
           <TopStoryFetcher onFetch={onFetchStory} isLoading={isFetchingStory} />
        </div>
        <div>
          <label htmlFor="viewpoint-select" className="block text-sm font-medium text-gray-300 mb-2">
            Political Viewpoint
          </label>
          <ViewpointSelector
            selectedViewpointId={selectedViewpointId}
            setSelectedViewpointId={setSelectedViewpointId}
            isLoading={isLoading}
          />
        </div>
      </div>
      {selectedViewpoint && (
        <p className="text-sm text-gray-400 mt-3 text-center md:text-left">
            <strong>Perspective:</strong> {selectedViewpoint.description}
        </p>
      )}

      {needsManualContext && (
        <div className="mt-6 p-4 bg-yellow-900/30 rounded-md border border-yellow-700/50 animate-fade-in">
            <h3 className="font-semibold text-yellow-300">Additional Context Needed</h3>
            <p className="text-sm text-yellow-400/80 mb-4">
                We couldn't automatically fetch the content from this link. For the best results, please provide the post's text and a screenshot below.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="context-text" className="block text-sm font-medium text-gray-300 mb-2">
                        Post Text (Optional)
                    </label>
                    <textarea
                        id="context-text"
                        rows={4}
                        value={contextText}
                        onChange={(e) => setContextText(e.target.value)}
                        placeholder="Paste the text from the social media post here..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="context-image" className="block text-sm font-medium text-gray-300 mb-2">
                        Post Screenshot (Optional)
                    </label>
                    <input
                        type="file"
                        id="context-image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50 cursor-pointer"
                        disabled={isLoading}
                    />
                    {contextImageFile && <p className="text-xs text-gray-400 mt-2 truncate" title={contextImageFile.name}>Selected: {contextImageFile.name}</p>}
                </div>
            </div>
        </div>
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