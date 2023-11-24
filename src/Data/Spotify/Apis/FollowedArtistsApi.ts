import qs from "qs"

import { redirectToAuthCodeFlow } from "./AuthApi.ts"
import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { SpotifyArtist } from "../Models/SpotifyArtist.ts"

const pageSize = 50

export async function fetchFollowedArtists(appContext: AppContextType, lastArtistId: string | undefined): Promise<SpotifyArtist[]> {
  const { spotifyApiAccessToken } = appContext

  // TODO: remove
  console.log("fetchFollowedArtists")

  if (!spotifyApiAccessToken) {
    throw new Error("No Spotify API access token found in app context")
  }

  const queryParams = {
    type: "artist",
    limit: pageSize,
    after: lastArtistId
  }

  const result = await fetch(`${config.SPOTIFY_API_URL}/me/following?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${spotifyApiAccessToken}` }
  })

  if (!result.ok) {
    if ([httpStatusCode.UNAUTHORIZED, httpStatusCode.FORBIDDEN].includes(result.status)) {
      // TODO: remove
      console.log("fetchFollowedArtists > redirectToAuthCodeFlow")

      await redirectToAuthCodeFlow(appContext)
    }

    /* if (result.status === httpStatusCode.UNAUTHORIZED) {
      if (shouldRetry) {
        await refreshToken()
        return fetchFollowedArtists(lastArtistId, false)
      } else {
        await redirectToAuthCodeFlow()
      }
    }

    if (result.status === httpStatusCode.FORBIDDEN) {
      await redirectToAuthCodeFlow()
    } */

    throw new Error("Error while fetching followed artists")
  }

  const json = await result.json() as {
    artists: { items: SpotifyArtist[] }
  }

  return json.artists.items
}
