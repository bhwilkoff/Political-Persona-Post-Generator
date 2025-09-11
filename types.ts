export interface PoliticalViewpoint {
  id: string;
  name: string;
  description: string;
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