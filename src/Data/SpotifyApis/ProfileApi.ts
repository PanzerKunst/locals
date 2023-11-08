import { redirectToAuthCodeFlow } from "./AuthApi.ts"
import { httpStatusCode } from "../../Util/HttpUtils.ts"
import { getSpotifyApiAccessTokenFromLocalStorage } from "../../Util/LocalStorage.ts"
import { SpotifyUserProfile } from "../SpotifyModels/SpotifyUserProfile.ts"

export async function fetchProfile(): Promise<SpotifyUserProfile> {
  // TODO: remove
  console.log("fetchProfile")

  const accessToken = getSpotifyApiAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error("No Spotify API access token found in local storage")
  }

  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  if (!result.ok) {
    if ([httpStatusCode.UNAUTHORIZED, httpStatusCode.FORBIDDEN].includes(result.status)) {
      await redirectToAuthCodeFlow()
    }

    /* if (result.status === httpStatusCode.UNAUTHORIZED) {
      if (shouldRetry) {
        await refreshToken()
        return fetchProfile(false)
      } else {
        await redirectToAuthCodeFlow()
      }
    }

    if (result.status === httpStatusCode.FORBIDDEN) {
      await redirectToAuthCodeFlow()
    } */

    throw new Error("Error while fetching profile")
  }

  return await result.json() as SpotifyUserProfile
}
