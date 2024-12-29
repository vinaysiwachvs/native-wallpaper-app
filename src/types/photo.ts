type SearchPayload = {
  total_results: number;
  page: number;
  per_page: number;
  photos: Photo[];
};

type Photo = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_id: string;
  photographer_url: string;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    protrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
};