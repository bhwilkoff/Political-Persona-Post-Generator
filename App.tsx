import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { GeneratorForm } from './components/GeneratorForm';
import { ResultDisplay } from './components/ResultDisplay';
import { generatePostContent, generatePostImage, getTopStoryUrl } from './services/geminiService';
import { POLITICAL_VIEWPOINTS } from './constants';
import type { GeneratedPost } from './types';

function App() {
  const [url, setUrl] = useState<string>('');
  const [contextText, setContextText] = useState<string>('');
  const [contextImageFile, setContextImageFile] = useState<File | null>(null);
  const [selectedViewpointId, setSelectedViewpointId] = useState<string>(POLITICAL_VIEWPOINTS[0].id);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingStory, setIsFetchingStory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [needsManualContext, setNeedsManualContext] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when the primary input (URL) changes
    setNeedsManualContext(false);
    setGeneratedPost(null);
    setError(null);
  }, [url]);

  const handleFetchTopStory = async (rssUrl: string) => {
    setIsFetchingStory(true);
    setError(null);
    try {
      const storyUrl = await getTopStoryUrl(rssUrl);
      setUrl(storyUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching the story.');
    } finally {
      setIsFetchingStory(false);
    }
  };


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
    // Don't reset manual context flag here, allow user to fill it out after failure

    const selectedViewpoint = POLITICAL_VIEWPOINTS.find(v => v.id === selectedViewpointId);

    if (!selectedViewpoint) {
      setError('Invalid political viewpoint selected.');
      setIsLoading(false);
      return;
    }

    try {
      let postImageBase64: string | undefined = undefined;
      if (contextImageFile) {
        postImageBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(contextImageFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
      }

      const result = await generatePostContent(
        url, 
        selectedViewpoint,
        (contextText || postImageBase64) ? { postText: contextText, postImageBase64 } : undefined
      );

      if (result.requiresContext) {
        setNeedsManualContext(true);
        setIsLoading(false);
        return;
      }
      
      const { text: postText, shortText, sources } = result;
      let imageUrl: string;

      try {
        imageUrl = await generatePostImage(postText);
      } catch (imageError) {
        console.warn("Image generation failed. Displaying a placeholder.", imageError);
        // Using a data URL for a placeholder SVG image that indicates failure
        imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzNzQxNTIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNjBweCIgZmlsbD0iI2E4YmFjNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIGdlbmVyYXRpb24gZmFpbGVkIGR1ZSB0byByYXRlIGxpbWl0PC90ZXh0Pjwvc3ZnPg==';
      }


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
  }, [url, selectedViewpointId, contextText, contextImageFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main>
          <GeneratorForm
            url={url}
            setUrl={setUrl}
            contextText={contextText}
            setContextText={setContextText}
            contextImageFile={contextImageFile}
            setContextImageFile={setContextImageFile}
            selectedViewpointId={selectedViewpointId}
            setSelectedViewpointId={setSelectedViewpointId}
            isLoading={isLoading || isFetchingStory}
            isFetchingStory={isFetchingStory}
            needsManualContext={needsManualContext}
            onGenerate={handleGeneratePost}
            onFetchStory={handleFetchTopStory}
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