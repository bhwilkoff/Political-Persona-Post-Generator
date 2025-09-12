import React from 'react';
import type { GeneratedPost } from '../types';
import { ShareButton } from './ShareButton';

interface PostCardProps {
  post: GeneratedPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in">
      <img src={post.imageUrl} alt="Generated for the post" className="w-full bg-black" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-400">
                Longform Reaction
            </h4>
            <ShareButton text={post.text} imageUrl={post.imageUrl} />
        </div>
        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
          {post.text}
        </p>
      </div>
      {post.shortText && (
        <div className="px-6 py-4 bg-gray-900/40 border-t border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-400">
              Shortform Reaction
            </h4>
            <ShareButton text={post.shortText} />
          </div>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
            {post.shortText}
          </p>
        </div>
      )}
       {post.sources && post.sources.length > 0 && (
         <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Sources:</h4>
            <ul className="list-disc list-inside space-y-1">
                {post.sources.map((source, index) => (
                    <li key={index} className="text-sm text-gray-400 truncate">
                        <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-purple-400 hover:text-purple-300 hover:underline"
                            title={source.uri}
                        >
                            {source.title || source.uri}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

// Add fade-in animation to tailwind config or a style tag if not using a pre-processor
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);