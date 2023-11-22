type Config = {
  readonly BACKEND_URL: string;
  readonly SPOTIFY_API_URL: string;
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_AUTH_REDIRECT_URI: string;
}

export const config: Config = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL!,
  SPOTIFY_API_URL: import.meta.env.VITE_SPOTIFY_API_URL!,
  SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID!,
  SPOTIFY_AUTH_REDIRECT_URI: import.meta.env.VITE_SPOTIFY_AUTH_REDIRECT_URI!
}
