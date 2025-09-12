export interface PoliticalViewpoint {
  id: string;
  name: string;
  description: string;
}

// FIX: Add NewsSource interface for type safety in constants.ts
export interface NewsSource {
  id: string;
  name: string;
  rssUrl: string;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface GeneratedPost {
  imageUrl: string;
  text: string;
  shortText: string;
  sources: GroundingSource[];
}

export type GenerateContentResult = {
  text: string;
  shortText: string;
  sources: GroundingSource[];
  requiresContext?: boolean;
}