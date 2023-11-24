import { SpotifyUserProfile } from "../Data/Spotify/Models/SpotifyUserProfile.ts"

const sessionStorageKeys = {
  spotifyProfile: "spotifyProfile"
}


// spotifyProfile

export function getSpotifyProfileFromSession(): SpotifyUserProfile | undefined {
  const spotifyProfileInSession = window.sessionStorage.getItem(sessionStorageKeys.spotifyProfile)

  // TODO: remove
  console.log("getSpotifyProfileFromSession", spotifyProfileInSession)

  return spotifyProfileInSession
    ? JSON.parse(spotifyProfileInSession)
    : undefined
}

export function saveSpotifyProfileInSession(spotifyProfile: SpotifyUserProfile | undefined): void {
  // TODO: remove
  console.log("saveSpotifyProfileInSession", spotifyProfile)

  if (!spotifyProfile) {
    window.sessionStorage.removeItem(sessionStorageKeys.spotifyProfile)
    return
  }

  window.sessionStorage.setItem(sessionStorageKeys.spotifyProfile, JSON.stringify(spotifyProfile))
}
