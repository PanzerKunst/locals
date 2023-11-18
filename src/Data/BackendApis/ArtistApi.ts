import _ from "lodash"

import { config } from "../../config.ts"
import { Artist } from "../BackendModels/Artist.ts"
import { SpotifyArtist } from "../SpotifyModels/SpotifyArtist.ts"
import { SpotifyUserProfile } from "../SpotifyModels/SpotifyUserProfile.ts"

export async function storeUserFavouriteArtists(spotifyUserProfile: SpotifyUserProfile, spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  const withoutDuplicates: SpotifyArtist[] = _.uniqBy(spotifyArtists, "id")
  const url = `${config.BACKEND_URL}/userFavouriteArtists`

  const result = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      spotifyUserProfile,
      artists: withoutDuplicates
    })
  })

  if (!result.ok) {
    throw new Error("Error while storing userFavouriteArtists")
  }

  return await result.json() as Artist[]
}
