const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export class TmdbApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "TmdbApiError";
    this.status = status;
  }
}

export type TmdbSearchParams = Record<
  string,
  string | number | boolean | undefined
>;

interface TmdbFetchOptions {
  path: string;
  searchParams?: TmdbSearchParams;
}

const TMDB_TIMEOUT_MS = 8000;


export async function tmdbFetch<T>({
  path,
  searchParams,
}: TmdbFetchOptions): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("متغیر محیطی TMDB_API_KEY تنظیم نشده است");
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TMDB_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: "application/json",
      },
      // داده‌ی سرچ/ترند نسبتاً پویاست، کش نمی‌کنیم
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new TmdbApiError("اتصال به TMDB تایم‌اوت شد", 504);
    }
    throw new TmdbApiError("برقراری ارتباط با TMDB ناموفق بود", 503);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new TmdbApiError(
      `درخواست به TMDB با وضعیت ${response.status} ناموفق بود`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
