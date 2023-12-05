import { isPostCompatible, EmptyPost } from "../Data/Backend/Models/Posts.ts"
import { SpotifyUserProfile } from "../Data/Spotify/Models/SpotifyUserProfile.ts"

const sessionStorageKeys = {
  spotifyProfile: "spotifyProfile",
  emptyPost: "emptyPost"
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


// emptyPost

export function getEmptyPostFromSession(): EmptyPost | undefined {
  const emptyPostInSession = window.sessionStorage.getItem(sessionStorageKeys.emptyPost)

  if (!emptyPostInSession) {
    return undefined
  }

  const emptyPost = JSON.parse(emptyPostInSession)

  return isPostCompatible(emptyPost, true)
    ? emptyPost
    : undefined
}

export function saveEmptyPostInSession(emptyPost: EmptyPost | undefined): void {
  if (!emptyPost) {
    window.sessionStorage.removeItem(sessionStorageKeys.emptyPost)
    return
  }

  window.sessionStorage.setItem(sessionStorageKeys.emptyPost, JSON.stringify(emptyPost))
}
