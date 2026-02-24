// Core travel package type
export interface TravelPackage {
  id: number;
  title: string;
  location: string;
  price: number;
  tags: string[];
}

// Search-related types
export interface SearchResult extends TravelPackage {
  reasoning: string;
}

export interface SearchResponse {
  results: SearchResult[];
  message?: string;
  query: string;
}

// Component prop types
export interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  error: string;
}

export interface TravelCardProps {
  package: SearchResult;
}
