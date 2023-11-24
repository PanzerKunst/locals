import { SpotifyUserProfile } from "../Data/Spotify/Models/SpotifyUserProfile.ts"

const sessionStorageKeys = {
  spotifyProfile: "spotifyProfile"
}


// spotifyProfile

export function getSpotifyProfileFromSession(): SpotifyUserProfile | undefined {
  const spotifyProfileInSession = window.sessionStorage.getItem(sessionStorageKeys.spotifyProfile)

  return spotifyProfileInSession
    ? JSON.parse(spotifyProfileInSession)
    : undefined
}

export function saveSpotifyProfileInSession(spotifyProfile: SpotifyUserProfile | undefined): void {
  if (!spotifyProfile) {
    window.sessionStorage.removeItem(sessionStorageKeys.spotifyProfile)
    return
  }

  window.sessionStorage.setItem(sessionStorageKeys.spotifyProfile, JSON.stringify(spotifyProfile))
}
