// این فایل شکل دقیق و خام (snake_case) پاسخ‌های TMDB رو نگه می‌داره.
// این‌ها تایپ‌های "خام"‌ان؛ توی هر فیچر (مثل explore) یه تایپ دامنه‌ای
// (camelCase، فقط فیلدهای لازم) ازشون map میشه. این‌طوری اگه TMDB چیزی رو
// عوض کرد، فقط لایه‌ی map کردن تغییر می‌کنه نه کل کدبیس.

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// نتیجه‌ی خام یک فیلم (از /trending/movie و /search/multi)
export interface TmdbMovieRaw {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  poster_path: string | null;
  media_type: "movie";
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// نتیجه‌ی خام یک سریال (از /trending/tv و /search/multi)
export interface TmdbTvRaw {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_name: string;
  original_language: string;
  overview: string;
  poster_path: string | null;
  media_type: "tv";
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

// نتیجه‌ی خام یک شخص (بازیگر/کارگردان و ...) از /search/multi
// فعلاً توی explore فیلتر میشه، ولی تایپش رو نگه می‌داریم چون احتمالاً
// بعداً (مثلاً برای صفحه‌ی پروفایل بازیگر) لازم میشه.
export interface TmdbPersonRaw {
  adult: boolean;
  id: number;
  name: string;
  original_name: string;
  media_type: "person";
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string | null;
  known_for: Array<TmdbMovieRaw | TmdbTvRaw>;
}

export type TmdbMultiSearchRaw = TmdbMovieRaw | TmdbTvRaw | TmdbPersonRaw;

// -----------------------------------------------------------------------------
// Detail endpoints (movie/{id}, tv/{id}, tv/{id}/season/{season_number})
// این‌ها هم تایپ‌های خام‌ان؛ لایه‌ی map توی features/media-details انجام میشه.
// -----------------------------------------------------------------------------

export interface TmdbGenreRaw {
  id: number;
  name: string;
}

export interface TmdbProductionCompanyRaw {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TmdbProductionCountryRaw {
  iso_3166_1: string;
  name: string;
}

export interface TmdbSpokenLanguageRaw {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TmdbCollectionRaw {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

// --- Movie detail ---
export interface TmdbMovieDetailRaw {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: TmdbCollectionRaw | null;
  budget: number;
  genres: TmdbGenreRaw[];
  homepage: string;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TmdbProductionCompanyRaw[];
  production_countries: TmdbProductionCountryRaw[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: TmdbSpokenLanguageRaw[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// --- TV detail ---
export interface TmdbCreatedByRaw {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string | null;
}

export interface TmdbNetworkRaw {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TmdbSeasonSummaryRaw {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

// نسخه‌ی خلاصه‌ی اپیزود که توی last_episode_to_air / next_episode_to_air میاد
export interface TmdbEpisodeRefRaw {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string | null;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface TmdbTvDetailRaw {
  adult: boolean;
  backdrop_path: string | null;
  created_by: TmdbCreatedByRaw[];
  episode_run_time: number[];
  first_air_date: string;
  genres: TmdbGenreRaw[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string | null;
  last_episode_to_air: TmdbEpisodeRefRaw | null;
  name: string;
  next_episode_to_air: TmdbEpisodeRefRaw | null;
  networks: TmdbNetworkRaw[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TmdbProductionCompanyRaw[];
  production_countries: TmdbProductionCountryRaw[];
  seasons: TmdbSeasonSummaryRaw[];
  spoken_languages: TmdbSpokenLanguageRaw[];
  status: string;
  tagline: string | null;
  type: string;
  vote_average: number;
  vote_count: number;
}

// --- Season detail (tv/{id}/season/{season_number}) ---
// نکته: توی پاسخ خام TMDB، هر اپیزود آرایه‌های crew و guest_stars هم داره
// (اطلاعات بازیگر/عوامل سازنده). طبق تصمیم گرفته‌شده، فعلاً اون فیلدها اینجا
// تایپ نشدن و توی مرحله‌ی Cast (فاز بعدی) اضافه میشن. وجودشون توی پاسخ خام
// runtime مشکلی ایجاد نمی‌کنه، فقط توسط mapper نادیده گرفته میشن.
export interface TmdbSeasonEpisodeRaw {
  air_date: string | null;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TmdbSeasonDetailRaw {
  _id: string;
  air_date: string | null;
  episodes: TmdbSeasonEpisodeRaw[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}