type Config = {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_AUTH_REDIRECT_URI: string;
}

const config: Config = {
  SPOTIFY_CLIENT_ID: "3e38c6df20b84e57805a855aaa18515b",
  SPOTIFY_AUTH_REDIRECT_URI: "http://localhost:3000/spotify-callback"
}

export default config
