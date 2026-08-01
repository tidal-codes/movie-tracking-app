import type {
  TmdbMovieRaw,
  TmdbMultiSearchRaw,
  TmdbTvRaw,
} from "@/shared/lib/tmdb/types";
import type {
  ExploreMediaSummary,
  MovieSummary,
  TvShowSummary,
} from "../model/types";

export function mapMovieSummary(raw: TmdbMovieRaw): MovieSummary {
  return {
    mediaType: "movie",
    id: raw.id,
    title: raw.title,
    originalTitle: raw.original_title,
    originalLanguage: raw.original_language,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    genreIds: raw.genre_ids,
    popularity: raw.popularity,
    releaseDate: raw.release_date || null,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    adult: raw.adult,
  };
}

export function mapTvShowSummary(raw: TmdbTvRaw): TvShowSummary {
  return {
    mediaType: "tv",
    id: raw.id,
    name: raw.name,
    originalName: raw.original_name,
    originalLanguage: raw.original_language,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    genreIds: raw.genre_ids,
    popularity: raw.popularity,
    firstAirDate: raw.first_air_date || null,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    originCountry: raw.origin_country,
    adult: raw.adult,
  };
}


export function mapMultiSearchResults(
  raw: TmdbMultiSearchRaw[],
): ExploreMediaSummary[] {
  const results: ExploreMediaSummary[] = [];

  for (const item of raw) {
    if (item.media_type === "movie") {
      results.push(mapMovieSummary(item));
    } else if (item.media_type === "tv") {
      results.push(mapTvShowSummary(item));
    }
    // media_type === "person" -> عمداً نادیده گرفته میشه
  }

  return results;
}
