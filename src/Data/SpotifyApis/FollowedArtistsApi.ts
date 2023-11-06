import qs from "qs"

import { redirectToAuthCodeFlow } from "./AuthApi.ts"
import { httpStatusCode } from "../../Util/HttpUtils.ts"
import { getSpotifyApiAccessTokenFromLocalStorage } from "../../Util/LocalStorage.ts"
import { SpotifyArtist } from "../SpotifyModels/SpotifyArtist.ts"

const pageSize = 50

export async function fetchFollowedArtists(lastArtistId: string | undefined): Promise<SpotifyArtist[]> {
  // TODO: remove
  console.log("fetchFollowedArtists", lastArtistId)

  const spotifyApiAccessToken = getSpotifyApiAccessTokenFromLocalStorage()

  if (!spotifyApiAccessToken) {
    throw new Error("No Spotify API access token found in local storage")
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
      await redirectToAuthCodeFlow()
    }

    throw new Error("Error while fetching followed artists")
  }

  const json = await result.json() as {
    artists: { items: SpotifyArtist[] }
  }

  return json.artists.items
}
