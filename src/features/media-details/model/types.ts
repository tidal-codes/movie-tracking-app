// تایپ‌های دامنه‌ای (camelCase) مخصوص صفحه‌ی جزئیات فیلم/سریال/فصل.
// عمداً اسم‌شون Details گذاشته شده تا از MovieSummary/TvShowSummary فیچر
// explore کاملاً جدا بمونن — این‌ها داده‌ی کامل صفحه‌ی جزئیات‌ان، نه سطح کارتی.

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface ProductionCountry {
  code: string;
  name: string;
}

export interface SpokenLanguage {
  code: string;
  englishName: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  posterPath: string | null;
  backdropPath: string | null;
}

export interface MovieDetails {
  mediaType: "movie";
  id: number;
  title: string;
  originalTitle: string;
  originalLanguage: string;
  overview: string;
  tagline: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  genres: Genre[];
  status: string;
  releaseDate: string | null;
  runtime: number | null;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdbId: string | null;
  originCountry: string[];
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
  collection: Collection | null;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  adult: boolean;
  video: boolean;
}

export interface Network {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface CreatedBy {
  id: number;
  name: string;
  profilePath: string | null;
}

// خلاصه‌ی یک فصل، همون‌طوری که داخل tv/{id} برمی‌گرده (نه جزئیات کامل فصل)
export interface SeasonOverview {
  id: number;
  name: string;
  overview: string;
  seasonNumber: number;
  episodeCount: number;
  airDate: string | null;
  posterPath: string | null;
  voteAverage: number;
}

// خلاصه‌ی last_episode_to_air / next_episode_to_air
export interface EpisodeReference {
  id: number;
  name: string;
  overview: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate: string | null;
  runtime: number | null;
  stillPath: string | null;
  voteAverage: number;
  voteCount: number;
}

export interface TvShowDetails {
  mediaType: "tv";
  id: number;
  name: string;
  originalName: string;
  originalLanguage: string;
  overview: string;
  tagline: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  genres: Genre[];
  status: string;
  type: string;
  firstAirDate: string | null;
  lastAirDate: string | null;
  inProduction: boolean;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRunTime: number[];
  originCountry: string[];
  languages: string[];
  networks: Network[];
  createdBy: CreatedBy[];
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
  seasons: SeasonOverview[];
  lastEpisodeToAir: EpisodeReference | null;
  nextEpisodeToAir: EpisodeReference | null;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  adult: boolean;
}

// اپیزود داخل روت season (بدون crew/guest_stars طبق تصمیم گرفته‌شده)
export interface EpisodeSummary {
  id: number;
  name: string;
  overview: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeType: string;
  airDate: string | null;
  runtime: number | null;
  stillPath: string | null;
  voteAverage: number;
  voteCount: number;
}

export interface SeasonDetails {
  id: number;
  showId: number;
  name: string;
  overview: string;
  seasonNumber: number;
  airDate: string | null;
  posterPath: string | null;
  voteAverage: number;
  episodes: EpisodeSummary[];
}
