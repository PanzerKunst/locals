import qs from "qs"

import { redirectToAuthCodeFlow } from "./AuthApi.ts"
import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { SpotifyArtist } from "../Models/SpotifyArtist.ts"

const pageSize = 49

/**
 * @param appContext
 * @param pageNb starts at 0
 */
export async function fetchTopArtists(appContext: AppContextType, pageNb: number): Promise<SpotifyArtist[]> {
  const { spotifyApiAccessToken } = appContext

  // TODO: remove
  console.log("fetchTopArtists")

  if (!spotifyApiAccessToken) {
    throw new Error("No Spotify API access token found in app context")
  }

  const queryParams = {
    time_range: "medium_term",
    limit: pageSize,
    offset: pageSize * pageNb,
  }

  const result = await fetch(`${config.SPOTIFY_API_URL}/me/top/artists?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${spotifyApiAccessToken}` }
  })

  if (!result.ok) {
    /* if (result.status === httpStatusCode.UNAUTHORIZED) {
      if (shouldRetry) {
        await refreshToken()
        return fetchTopArtists(pageNb, false)
      } else {
        await redirectToAuthCodeFlow()
      }
    }

    if (result.status === httpStatusCode.FORBIDDEN) {
      await redirectToAuthCodeFlow()
    } */

    if ([httpStatusCode.UNAUTHORIZED, httpStatusCode.FORBIDDEN].includes(result.status)) {
      // TODO: remove
      console.log("fetchTopArtists > redirectToAuthCodeFlow")

      await redirectToAuthCodeFlow(appContext)
    }

    throw new Error("Error while fetching top artists")
  }

  const json = await result.json() as { items: SpotifyArtist[] }

  return json.items
}
