import { redirectToAuthCodeFlow, refreshToken } from "./AuthApi.ts"
import { AppContextType } from "../../AppContext.tsx"
import { httpStatusCode } from "../../Util/HttpUtils.ts"
import { SpotifyUserProfile } from "../SpotifyModels/SpotifyUserProfile.ts"

export async function fetchProfile(appContext: AppContextType, shouldRetry = true): Promise<SpotifyUserProfile> {
  // TODO: remove
  console.log("fetchProfile")

  const { spotifyApiAccessToken } = appContext

  if (!spotifyApiAccessToken) {
    throw new Error("No Spotify API access token found in app context")
  }

  const result = await fetch("https://api.spotify.com/v1/me", {
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
        await redirectToAuthCodeFlow(appContext)
      }
    }

    if (result.status === httpStatusCode.FORBIDDEN) {
      await redirectToAuthCodeFlow(appContext)
    }

    throw new Error("Error while fetching profile")
  }

  return await result.json() as SpotifyUserProfile
}
