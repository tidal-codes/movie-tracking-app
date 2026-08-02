import type {
  TmdbCreatedByRaw,
  TmdbEpisodeRefRaw,
  TmdbGenreRaw,
  TmdbMovieDetailRaw,
  TmdbNetworkRaw,
  TmdbProductionCompanyRaw,
  TmdbProductionCountryRaw,
  TmdbSeasonDetailRaw,
  TmdbSeasonEpisodeRaw,
  TmdbSeasonSummaryRaw,
  TmdbSpokenLanguageRaw,
  TmdbTvDetailRaw,
} from "@/shared/lib/tmdb/types";
import type {
  CreatedBy,
  EpisodeReference,
  EpisodeSummary,
  Genre,
  MovieDetails,
  Network,
  ProductionCompany,
  ProductionCountry,
  SeasonDetails,
  SeasonOverview,
  SpokenLanguage,
  TvShowDetails,
} from "../model/types";

function mapGenre(raw: TmdbGenreRaw): Genre {
  return { id: raw.id, name: raw.name };
}

function mapProductionCompany(
  raw: TmdbProductionCompanyRaw,
): ProductionCompany {
  return {
    id: raw.id,
    name: raw.name,
    logoPath: raw.logo_path,
    originCountry: raw.origin_country,
  };
}

function mapProductionCountry(
  raw: TmdbProductionCountryRaw,
): ProductionCountry {
  return { code: raw.iso_3166_1, name: raw.name };
}

function mapSpokenLanguage(raw: TmdbSpokenLanguageRaw): SpokenLanguage {
  return { code: raw.iso_639_1, englishName: raw.english_name, name: raw.name };
}

export function mapMovieDetails(raw: TmdbMovieDetailRaw): MovieDetails {
  return {
    mediaType: "movie",
    id: raw.id,
    title: raw.title,
    originalTitle: raw.original_title,
    originalLanguage: raw.original_language,
    overview: raw.overview,
    tagline: raw.tagline || null,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    genres: raw.genres.map(mapGenre),
    status: raw.status,
    releaseDate: raw.release_date || null,
    runtime: raw.runtime,
    budget: raw.budget,
    revenue: raw.revenue,
    homepage: raw.homepage || null,
    imdbId: raw.imdb_id,
    originCountry: raw.origin_country,
    productionCompanies: raw.production_companies.map(mapProductionCompany),
    productionCountries: raw.production_countries.map(mapProductionCountry),
    spokenLanguages: raw.spoken_languages.map(mapSpokenLanguage),
    collection: raw.belongs_to_collection
      ? {
          id: raw.belongs_to_collection.id,
          name: raw.belongs_to_collection.name,
          posterPath: raw.belongs_to_collection.poster_path,
          backdropPath: raw.belongs_to_collection.backdrop_path,
        }
      : null,
    popularity: raw.popularity,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    adult: raw.adult,
    video: raw.video,
  };
}

function mapNetwork(raw: TmdbNetworkRaw): Network {
  return {
    id: raw.id,
    name: raw.name,
    logoPath: raw.logo_path,
    originCountry: raw.origin_country,
  };
}

function mapCreatedBy(raw: TmdbCreatedByRaw): CreatedBy {
  return { id: raw.id, name: raw.name, profilePath: raw.profile_path };
}

function mapSeasonOverview(raw: TmdbSeasonSummaryRaw): SeasonOverview {
  return {
    id: raw.id,
    name: raw.name,
    overview: raw.overview,
    seasonNumber: raw.season_number,
    episodeCount: raw.episode_count,
    airDate: raw.air_date || null,
    posterPath: raw.poster_path,
    voteAverage: raw.vote_average,
  };
}

function mapEpisodeReference(
  raw: TmdbEpisodeRefRaw | null,
): EpisodeReference | null {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    overview: raw.overview,
    seasonNumber: raw.season_number,
    episodeNumber: raw.episode_number,
    airDate: raw.air_date || null,
    runtime: raw.runtime,
    stillPath: raw.still_path,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
  };
}

export function mapTvShowDetails(raw: TmdbTvDetailRaw): TvShowDetails {
  return {
    mediaType: "tv",
    id: raw.id,
    name: raw.name,
    originalName: raw.original_name,
    originalLanguage: raw.original_language,
    overview: raw.overview,
    tagline: raw.tagline || null,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    genres: raw.genres.map(mapGenre),
    status: raw.status,
    type: raw.type,
    firstAirDate: raw.first_air_date || null,
    lastAirDate: raw.last_air_date || null,
    inProduction: raw.in_production,
    numberOfSeasons: raw.number_of_seasons,
    numberOfEpisodes: raw.number_of_episodes,
    episodeRunTime: raw.episode_run_time,
    originCountry: raw.origin_country,
    languages: raw.languages,
    networks: raw.networks.map(mapNetwork),
    createdBy: raw.created_by.map(mapCreatedBy),
    productionCompanies: raw.production_companies.map(mapProductionCompany),
    productionCountries: raw.production_countries.map(mapProductionCountry),
    spokenLanguages: raw.spoken_languages.map(mapSpokenLanguage),
    seasons: raw.seasons.map(mapSeasonOverview),
    lastEpisodeToAir: mapEpisodeReference(raw.last_episode_to_air),
    nextEpisodeToAir: mapEpisodeReference(raw.next_episode_to_air),
    popularity: raw.popularity,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    adult: raw.adult,
  };
}

function mapEpisodeSummary(raw: TmdbSeasonEpisodeRaw): EpisodeSummary {
  return {
    id: raw.id,
    name: raw.name,
    overview: raw.overview,
    seasonNumber: raw.season_number,
    episodeNumber: raw.episode_number,
    episodeType: raw.episode_type,
    airDate: raw.air_date || null,
    runtime: raw.runtime,
    stillPath: raw.still_path,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
  };
}

export function mapSeasonDetails(
  raw: TmdbSeasonDetailRaw,
  showId: number,
): SeasonDetails {
  return {
    id: raw.id,
    showId,
    name: raw.name,
    overview: raw.overview,
    seasonNumber: raw.season_number,
    airDate: raw.air_date || null,
    posterPath: raw.poster_path,
    voteAverage: raw.vote_average,
    episodes: raw.episodes.map(mapEpisodeSummary),
  };
}
