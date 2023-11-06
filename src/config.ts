type Config = {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_AUTH_REDIRECT_URI: string;
}

export const config: Config = {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
  SPOTIFY_AUTH_REDIRECT_URI: process.env.SPOTIFY_AUTH_REDIRECT_URI!
}
