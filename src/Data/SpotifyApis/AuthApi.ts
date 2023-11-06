import qs from "qs"

import {
  getSpotifyApiVerifierFromLocalStorage,
  saveSpotifyApiAccessTokenInLocalStorage,
  saveSpotifyApiVerifierInLocalStorage
} from "../../Util/LocalStorage.ts"
import { config } from "../../config.ts"

export async function redirectToAuthCodeFlow() {
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)

  saveSpotifyApiAccessTokenInLocalStorage(undefined)
  saveSpotifyApiVerifierInLocalStorage(verifier)

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

export async function getAccessToken(code: string): Promise<string> {
  const spotifyVerifier = getSpotifyApiVerifierFromLocalStorage()

  // TODO: remove
  console.log("spotifyVerifier", spotifyVerifier)

  const queryParams = {
    client_id: config.SPOTIFY_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: config.SPOTIFY_AUTH_REDIRECT_URI,
    code_verifier: spotifyVerifier!
  }

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: qs.stringify(queryParams)
  })

  const { access_token } = await result.json()
  saveSpotifyApiAccessTokenInLocalStorage(access_token)

  return access_token
}

/* TODO
export async function getRefreshToken() {
  const refreshToken = getSpotifyApiRefreshTokenFromLocalStorage()

  if (!refreshToken) {
    await redirectToAuthCodeFlow()
  }

  const queryParams = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: config.SPOTIFY_CLIENT_ID
  }

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: qs.stringify(queryParams)
  })

  const { access_token, refresh_token } = await result.json()

  saveSpotifyApiAccessTokenInLocalStorage(access_token)
  saveSpotifyApiAccessTokenInLocalStorage(refresh_token)

  return access_token
} */

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
