type Config = {
  readonly IS_PROD: boolean;
  readonly BACKEND_URL: string;
  readonly SPOTIFY_API_URL: string;
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_AUTH_REDIRECT_URI: string;
  readonly GEOAPIFY_API_URL: string;
  readonly GEOAPIFY_API_KEY: string;
}

export const config: Config = {
  IS_PROD: import.meta.env.MODE === "production",
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL!,
  SPOTIFY_API_URL: import.meta.env.VITE_SPOTIFY_API_URL!,
  SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID!,
  SPOTIFY_AUTH_REDIRECT_URI: import.meta.env.VITE_SPOTIFY_AUTH_REDIRECT_URI!,
  GEOAPIFY_API_URL: import.meta.env.VITE_GEOAPIFY_API_URL!,
  GEOAPIFY_API_KEY: import.meta.env.VITE_GEOAPIFY_API_KEY!
}
