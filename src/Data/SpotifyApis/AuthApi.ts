import qs from "qs"

import { AppContextType } from "../../AppContext.tsx"
import { config } from "../../config.ts"

export async function redirectToAuthCodeFlow(appContext: AppContextType) {
  const { spotifyApiVerifier, setSpotifyApiVerifier, setSpotifyApiAccessToken, setSpotifyApiRefreshToken } = appContext
  const verifier = spotifyApiVerifier || generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)

  setSpotifyApiAccessToken(undefined)
  setSpotifyApiRefreshToken(undefined)
  setSpotifyApiVerifier(verifier)

  const queryParams = {
    client_id: config.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: config.SPOTIFY_AUTH_REDIRECT_URI,
    scope: "user-read-private user-read-email user-top-read user-follow-read",
    code_challenge_method: "S256",
    code_challenge: challenge
  }

  document.location = `https://accounts.spotify.com/authorize?${qs.stringify(queryParams)}`
}

export async function getAccessToken(appContext: AppContextType, code: string): Promise<string> {
  const { spotifyApiVerifier, setSpotifyApiAccessToken, setSpotifyApiRefreshToken } = appContext

  const queryParams = {
    client_id: config.SPOTIFY_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: config.SPOTIFY_AUTH_REDIRECT_URI,
    code_verifier: spotifyApiVerifier!
  }

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: qs.stringify(queryParams)
  })

  const { access_token, refresh_token } = await result.json()
  setSpotifyApiAccessToken(access_token)
  setSpotifyApiRefreshToken(refresh_token)

  return access_token
}

export async function refreshToken(appContext: AppContextType) {
  const { spotifyApiRefreshToken, setSpotifyApiAccessToken, setSpotifyApiRefreshToken } = appContext

  if (!spotifyApiRefreshToken) {
    // TODO: remove
    console.log("refreshToken > redirectToAuthCodeFlow")

    await redirectToAuthCodeFlow(appContext)
  }

  const queryParams = {
    grant_type: "refresh_token",
    refresh_token: spotifyApiRefreshToken,
    client_id: config.SPOTIFY_CLIENT_ID
  }

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: qs.stringify(queryParams)
  })

  const { access_token, refresh_token } = await result.json()
  setSpotifyApiAccessToken(access_token)
  setSpotifyApiRefreshToken(refresh_token)
}

function generateCodeVerifier(length: number) {
  let text = ""
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await window.crypto.subtle.digest("SHA-256", data)

  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
