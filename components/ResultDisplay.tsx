
import React from 'react';
import type { GeneratedPost } from '../types';
import { Loader } from './Loader';
import { ErrorAlert } from './ErrorAlert';
import { PostCard } from './PostCard';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  generatedPost: GeneratedPost | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, generatedPost }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (generatedPost) {
    return <PostCard post={generatedPost} />;
  }

  return null;
};
