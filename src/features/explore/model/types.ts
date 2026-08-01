
export type ExploreMediaType = "movie" | "tv";

export interface MovieSummary {
  mediaType: "movie";
  id: number;
  title: string;
  originalTitle: string;
  originalLanguage: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
  popularity: number;
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
  adult: boolean;
}

export interface TvShowSummary {
  mediaType: "tv";
  id: number;
  name: string;
  originalName: string;
  originalLanguage: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
  popularity: number;
  firstAirDate: string | null;
  voteAverage: number;
  voteCount: number;
  originCountry: string[];
  adult: boolean;
}

// نتیجه‌ی سرچ: ترکیبی از فیلم و سریال (person قبلاً فیلتر شده)
export type ExploreMediaSummary = MovieSummary | TvShowSummary;

export interface PaginatedResult<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
