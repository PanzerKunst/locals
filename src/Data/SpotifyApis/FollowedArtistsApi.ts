import qs from "qs"

import { redirectToAuthCodeFlow } from "./AuthApi.ts"
import { AppContextType } from "../../AppContext.tsx"
import { httpStatusCode } from "../../Util/HttpUtils.ts"
import { SpotifyArtist } from "../SpotifyModels/SpotifyArtist.ts"

const pageSize = 50

export async function fetchFollowedArtists(appContext: AppContextType, lastArtistId: string | undefined): Promise<SpotifyArtist[]> {
  // TODO: remove
  console.log("fetchFollowedArtists", lastArtistId)

  const { spotifyApiAccessToken } = appContext

  if (!spotifyApiAccessToken) {
    throw new Error("No Spotify API access token found in app context")
  }

  const queryParams = {
    type: "artist",
    limit: pageSize,
    after: lastArtistId
  }

  const url = `https://api.spotify.com/v1/me/following?${qs.stringify(queryParams)}`

  const result = await fetch(url, {
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
