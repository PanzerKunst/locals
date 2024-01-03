import { PostWithTags, isPostWithTagsCompatible } from "../Data/Backend/Models/PostWithTags.ts"
import { SpotifyUserProfile } from "../Data/Spotify/Models/SpotifyUserProfile.ts"

const sessionStorageKeys = {
  spotifyProfile: "spotifyProfile",
  postWithTags: "postWithTags"
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


// postWithTags

export function getPostWithTagsFromSession(): PostWithTags | undefined {
  const postInSession = window.sessionStorage.getItem(sessionStorageKeys.postWithTags)

  if (!postInSession) {
    return undefined
  }

  const postWithTags = JSON.parse(postInSession) as PostWithTags

  return isPostWithTagsCompatible(postWithTags)
    ? postWithTags
    : undefined
}

export function savePostWithTagsInSession(postWithTags: PostWithTags | undefined): void {
  if (!postWithTags) {
    window.sessionStorage.removeItem(sessionStorageKeys.postWithTags)
    return
  }

  window.sessionStorage.setItem(sessionStorageKeys.postWithTags, JSON.stringify(postWithTags))
}
