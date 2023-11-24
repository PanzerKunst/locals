import { SpotifyUserProfile } from "../Data/Spotify/Models/SpotifyUserProfile.ts"

const sessionStorageKeys = {
  spotifyProfile: "spotifyProfile"
}


// spotifyProfile

export function getSpotifyProfileFromSessionStorage(): SpotifyUserProfile | undefined {
  const spofifyProfileInSession = window.sessionStorage.getItem(sessionStorageKeys.spotifyProfile)

  return spofifyProfileInSession
    ? JSON.parse(spofifyProfileInSession)
    : undefined
}

export function saveSpotifyProfileInSessionStorage(spotifyProfile: SpotifyUserProfile | undefined): void {
  if (!spotifyProfile) {
    window.sessionStorage.removeItem(sessionStorageKeys.spotifyProfile)
    return
  }

  window.sessionStorage.setItem(sessionStorageKeys.spotifyProfile, JSON.stringify(spotifyProfile))
}
