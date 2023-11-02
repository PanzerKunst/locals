import qs from "qs"

import config from "../../config.ts"

export async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)

  localStorage.setItem("verifier", verifier)

  const queryParams = {
    client_id: clientId,
    response_type: "code",
    redirect_uri: config.SPOTIFY_AUTH_REDIRECT_URI,
    scope: "user-read-private user-read-email",
    code_challenge_method: "S256",
    code_challenge: challenge
  }

  document.location = `https://accounts.spotify.com/authorize?${qs.stringify(queryParams)}`
}

export async function getAccessToken(clientId: string, code: string) {
  // TODO: remove
  console.log("getAccessToken")

  const verifier = localStorage.getItem("verifier")

  const queryParams = {
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: config.SPOTIFY_AUTH_REDIRECT_URI,
    code_verifier: verifier!
  }

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: qs.stringify(queryParams)
  })

  const { access_token } = await result.json()
  return access_token
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchProfile(token: string): Promise<any> {
  // TODO: remove
  console.log("fetchProfile")

  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  })

  return await result.json()
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
