import React, { useState } from 'react';

interface ShareButtonProps {
  text: string;
  imageUrl?: string;
}

// Helper function to convert data URL to File object
async function dataURLtoFile(dataUrl: string, filename: string): Promise<File | null> {
    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
    } catch (e) {
        console.error("Error converting data URL to file", e);
        return null;
    }
}


export const ShareButton: React.FC<ShareButtonProps> = ({ text, imageUrl }) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const handleShare = async () => {
    const shareData: ShareData = {
      text: text,
      title: 'AI Generated Social Media Post',
    };

    let canShareFiles = false;
    let imageFile: File | null = null;
    
    if (imageUrl && navigator.share) {
        imageFile = await dataURLtoFile(imageUrl, 'generated-post.jpg');
        if(imageFile) {
            shareData.files = [imageFile];
            canShareFiles = navigator.canShare ? navigator.canShare({ files: [imageFile] }) : false;
        }
    }

    // Use Web Share API if available and can share files, or if no image is present
    if (navigator.share && (canShareFiles || !imageUrl)) {
      try {
        await navigator.share(shareData);
        setFeedbackMessage('Shared successfully!');
      } catch (error) {
        // Fallback to copy if sharing is canceled or fails, but not for abort errors.
        if ((error as DOMException).name !== 'AbortError') {
             navigator.clipboard.writeText(text).then(() => {
                setFeedbackMessage('Share failed. Copied to clipboard!');
            }, () => {
                setFeedbackMessage('Failed to share or copy.');
            });
        }
      }
    } else { // Fallback to clipboard for browsers that don't support Web Share API
        navigator.clipboard.writeText(text).then(() => {
            setFeedbackMessage('Copied to clipboard!');
        }, () => {
            setFeedbackMessage('Failed to copy.');
        });
    }

    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        {navigator.share ? 'Share' : 'Copy'}
      </button>
      {feedbackMessage && (
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs rounded py-1 px-2">
          {feedbackMessage}
        </span>
      )}
    </div>
  );
};