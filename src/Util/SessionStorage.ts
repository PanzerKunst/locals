import { EmptyPostWithTags, isPostWithTagsCompatible } from "../Data/Backend/Models/PostWithTags.ts"
import { SpotifyUserProfile } from "../Data/Spotify/Models/SpotifyUserProfile.ts"

const sessionStorageKeys = {
  spotifyProfile: "spotifyProfile",
  emptyPostWithTags: "emptyPostWithTags"
}


// spotifyProfile

export function getSpotifyProfileFromSession(): SpotifyUserProfile | undefined {
  const spotifyProfileInSession = window.sessionStorage.getItem(sessionStorageKeys.spotifyProfile)

  return spotifyProfileInSession
    ? JSON.parse(spotifyProfileInSession) as SpotifyUserProfile
    : undefined
}

export function saveSpotifyProfileInSession(spotifyProfile: SpotifyUserProfile | undefined): void {
  if (!spotifyProfile) {
    window.sessionStorage.removeItem(sessionStorageKeys.spotifyProfile)
    return
  }

  window.sessionStorage.setItem(sessionStorageKeys.spotifyProfile, JSON.stringify(spotifyProfile))
}


// emptyPostWithTags

export function getEmptyPostWithTagsFromSession(): EmptyPostWithTags | undefined {
  const emptyPostInSession = window.sessionStorage.getItem(sessionStorageKeys.emptyPostWithTags)

  if (!emptyPostInSession) {
    return undefined
  }

  const emptyPostWithTags = JSON.parse(emptyPostInSession) as EmptyPostWithTags

  return isPostWithTagsCompatible(emptyPostWithTags, true)
    ? emptyPostWithTags
    : undefined
}

export function saveEmptyPostWithTagsInSession(emptyPostWithTags: EmptyPostWithTags | undefined): void {
  if (!emptyPostWithTags) {
    window.sessionStorage.removeItem(sessionStorageKeys.emptyPostWithTags)
    return
  }

  window.sessionStorage.setItem(sessionStorageKeys.emptyPostWithTags, JSON.stringify(emptyPostWithTags))
}
