import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { GeneratorForm } from './components/GeneratorForm';
import { ResultDisplay } from './components/ResultDisplay';
import { generatePostContent, generatePostImage } from './services/geminiService';
import { POLITICAL_VIEWPOINTS } from './constants';
import type { GeneratedPost, PoliticalViewpoint } from './types';

function App() {
  const [url, setUrl] = useState<string>('');
  const [selectedViewpointId, setSelectedViewpointId] = useState<string>(POLITICAL_VIEWPOINTS[0].id);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePost = useCallback(async () => {
    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    // A simple URL validation regex
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if (!urlPattern.test(url)) {
        setError('Please enter a valid URL.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);

    const selectedViewpoint = POLITICAL_VIEWPOINTS.find(v => v.id === selectedViewpointId);

    if (!selectedViewpoint) {
      setError('Invalid political viewpoint selected.');
      setIsLoading(false);
      return;
    }

    try {
      const { text: postText, shortText, sources } = await generatePostContent(url, selectedViewpoint);
      
      const imageUrl = await generatePostImage(postText);

      setGeneratedPost({
        imageUrl,
        text: postText,
        shortText,
        sources
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console and ensure your API key is configured correctly.');
    } finally {
      setIsLoading(false);
    }
  }, [url, selectedViewpointId]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main>
          <GeneratorForm
            url={url}
            setUrl={setUrl}
            selectedViewpointId={selectedViewpointId}
            setSelectedViewpointId={setSelectedViewpointId}
            isLoading={isLoading}
            onGenerate={handleGeneratePost}
          />
          <ResultDisplay
            isLoading={isLoading}
            error={error}
            generatedPost={generatedPost}
          />
        </main>
      </div>
    </div>
  );
}

export default App;