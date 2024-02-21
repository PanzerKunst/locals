import { savePostWithTagsInSession } from "./SessionStorage.ts"
import { removeAccents, removePunctuation } from "./StringUtils.ts"
import { AppContextType } from "../AppContext.tsx"

export function asTag(text: string) {
  const withoutAccents = removeAccents(text)

  return removePunctuation(withoutAccents)
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join("")
}

export function signUserOut(appContext: AppContextType) {
  const { setSpotifyApiAccessToken, setSpotifyApiRefreshToken, setLoggedInUser } = appContext

  savePostWithTagsInSession(undefined)

  setSpotifyApiAccessToken(undefined)
  setSpotifyApiRefreshToken(undefined)
  setLoggedInUser(undefined)
}
