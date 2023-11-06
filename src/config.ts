type Config = {
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_AUTH_REDIRECT_URI: string;
}

export const config: Config = {
  SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID!,
  SPOTIFY_AUTH_REDIRECT_URI: import.meta.env.VITE_SPOTIFY_AUTH_REDIRECT_URI!
}
