import qs from "qs"

import { redirectToAuthCodeFlow } from "./AuthApi.ts"
import { httpStatusCode } from "../../Util/HttpUtils.ts"
import { getSpotifyApiAccessTokenFromLocalStorage } from "../../Util/LocalStorage.ts"
import { SpotifyArtist } from "../SpotifyModels/SpotifyArtist.ts"

const pageSize = 49

/**
 * @param pageNb starts at 0
 */
export async function fetchTopArtists(pageNb: number): Promise<SpotifyArtist[]> {
  // TODO: remove
  console.log("fetchTopArtists", pageNb)

  const accessToken = getSpotifyApiAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error("No Spotify API access token found in local storage")
  }

  const queryParams = {
    time_range: "short_term",
    limit: pageSize,
    offset: pageSize * pageNb,
  }

  const url = `https://api.spotify.com/v1/me/top/artists?${qs.stringify(queryParams)}`

  const result = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }
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
      await redirectToAuthCodeFlow()
    }

    throw new Error("Error while fetching top artists")
  }

  const json = await result.json() as { items: SpotifyArtist[] }

  return json.items
}
