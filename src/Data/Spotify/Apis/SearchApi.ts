import qs from "qs"

import { redirectToAuthCodeFlow } from "./AuthApi.ts"
import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { SpotifyArtist } from "../Models/SpotifyArtist.ts"

export async function searchArtists(appContext: AppContextType, q: string): Promise<SpotifyArtist[]> {
  const { spotifyApiAccessToken } = appContext

  if (!spotifyApiAccessToken) {
    throw new Error("No Spotify API access token found in app context")
  }

  const queryParams = { type: "artist", q }

  const result = await fetch(`${config.SPOTIFY_API_URL}/search?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${spotifyApiAccessToken}` }
  })

  if (!result.ok) {
    if ([httpStatusCode.UNAUTHORIZED, httpStatusCode.FORBIDDEN].includes(result.status)) {
      // TODO: remove
      console.log("searchArtists > redirectToAuthCodeFlow")

      await redirectToAuthCodeFlow(appContext)
    }

    throw new Error("Error while searching artist")
  }

  const json = await result.json() as { artists: { items: SpotifyArtist[] }}

  return json.artists.items
}
