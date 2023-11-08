import dayjs from "dayjs"

type ContextInLocalStorage = {
  spotifyApiVerifier?: string;
  spotifyApiAccessToken?: string;
  spotifyApiRefreshToken?: string;
  spotifyApiTokenExpirationDate?: string;
}

// Generated at https://chat.openai.com/c/59314a97-9171-4dd4-bbdb-9ec32b9e9c1f
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isContextCompatible(obj: any): obj is ContextInLocalStorage {
// Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  // Get all keys of the object
  const keys = Object.keys(obj)

  // List of allowed keys in the ContextInLocalStorage type
  const allowedKeys = ["spotifyApiVerifier", "spotifyApiAccessToken", "spotifyApiRefreshToken", "spotifyApiTokenExpirationDate"]

  // Check for no additional keys
  if (keys.some(key => !allowedKeys.includes(key))) {
    return false
  }

  // Check for the existence and type of optional properties
  if (obj.spotifyApiVerifier && typeof obj.spotifyApiVerifier !== "string") {
    return false
  }
  if (obj.spotifyApiAccessToken && typeof obj.spotifyApiAccessToken !== "string") {
    return false
  }
  if (obj.spotifyApiRefreshToken && typeof obj.spotifyApiRefreshToken !== "string") {
    return false
  }
  if (obj.spotifyApiTokenExpirationDate && typeof obj.spotifyApiTokenExpirationDate !== "string") {
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}

const localStorageKey = "context"

const defaultContext: ContextInLocalStorage = {}

function getContextFromLocalStorage(): ContextInLocalStorage {
  const contextStringInStorage = window.localStorage.getItem(localStorageKey)

  if (!contextStringInStorage) {
    return defaultContext
  }

  const contextInStorage: ContextInLocalStorage = JSON.parse(contextStringInStorage)

  if (!isContextCompatible(contextInStorage)) {
    window.localStorage.removeItem(localStorageKey)
    return defaultContext
  }

  return contextInStorage
}


// spotifyApiVerifier

export function getSpotifyApiVerifierFromLocalStorage(): string | undefined {
  return getContextFromLocalStorage().spotifyApiVerifier
}

export function saveSpotifyApiVerifierInLocalStorage(spotifyApiVerifier: string | undefined): void {
  const updatedContext: ContextInLocalStorage = {
    ...getContextFromLocalStorage(),
    spotifyApiVerifier,
  }

  window.localStorage.setItem(localStorageKey, JSON.stringify(updatedContext))
}


// spotifyApiAccessToken

export function getSpotifyApiAccessTokenFromLocalStorage(): string | undefined {
  return getContextFromLocalStorage().spotifyApiAccessToken
}

export function saveSpotifyApiAccessTokenInLocalStorage(spotifyApiAccessToken: string | undefined): void {
  const updatedContext: ContextInLocalStorage = {
    ...getContextFromLocalStorage(),
    spotifyApiAccessToken,
    spotifyApiTokenExpirationDate: dayjs().add(1, "hour").toISOString()
  }

  window.localStorage.setItem(localStorageKey, JSON.stringify(updatedContext))
}


// spotifyApiRefreshToken

export function getSpotifyApiRefreshTokenFromLocalStorage(): string | undefined {
  return getContextFromLocalStorage().spotifyApiRefreshToken
}

export function saveSpotifyApiRefreshTokenInLocalStorage(spotifyApiRefreshToken: string | undefined): void {
  const updatedContext: ContextInLocalStorage = {
    ...getContextFromLocalStorage(),
    spotifyApiRefreshToken,
  }

  window.localStorage.setItem(localStorageKey, JSON.stringify(updatedContext))
}
