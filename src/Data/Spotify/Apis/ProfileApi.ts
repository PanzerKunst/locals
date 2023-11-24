import { redirectToAuthCodeFlow, refreshToken } from "./AuthApi.ts"
import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { SpotifyUserProfile } from "../Models/SpotifyUserProfile.ts"

export async function fetchProfile(appContext: AppContextType, shouldRetry = true): Promise<SpotifyUserProfile> {
  const { spotifyApiAccessToken } = appContext

  // TODO: remove
  console.log("fetchProfile")

  if (!spotifyApiAccessToken) {
    throw new Error("No Spotify API access token found in app context")
  }

  const result = await fetch(`${config.SPOTIFY_API_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${spotifyApiAccessToken}` }
  })

  if (!result.ok) {
    /* if ([httpStatusCode.UNAUTHORIZED, httpStatusCode.FORBIDDEN].includes(result.status)) {
      await redirectToAuthCodeFlow()
    } */

    if (result.status === httpStatusCode.UNAUTHORIZED) {
      if (shouldRetry) {
        await refreshToken(appContext)
        return fetchProfile(appContext, false)
      } else {
        // TODO: remove
        console.log("fetchProfile > redirectToAuthCodeFlow 1")

        await redirectToAuthCodeFlow(appContext)
      }
    }

    if (result.status === httpStatusCode.FORBIDDEN) {
      // TODO: remove
      console.log("fetchProfile > redirectToAuthCodeFlow 2")

      await redirectToAuthCodeFlow(appContext)
    }

    throw new Error("Error while fetching profile")
  }

  return await result.json() as SpotifyUserProfile
}
