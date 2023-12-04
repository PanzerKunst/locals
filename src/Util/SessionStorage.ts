import _isEmpty from "lodash/isEmpty"

import { SpotifyUserProfile } from "../Data/Spotify/Models/SpotifyUserProfile.ts"

const sessionStorageKeys = {
  spotifyProfile: "spotifyProfile",
  editorContent: "editorContent"
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


// editorContent

// TODO: /!\ Beware /!\ This implementation is limited to a total content of 5MB, including base64 data from images!

export function getEditorContentFromSession(): string | undefined {
  const editorContentInSession = window.sessionStorage.getItem(sessionStorageKeys.editorContent)

  return _isEmpty(editorContentInSession)
    ? undefined
    : editorContentInSession!
}

export function saveEditorContentInSession(editorContent: string | undefined): void {
  if (!editorContent) {
    window.sessionStorage.removeItem(sessionStorageKeys.editorContent)
    return
  }

  window.sessionStorage.setItem(sessionStorageKeys.editorContent, editorContent)
}
