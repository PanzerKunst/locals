import { uniqBy as _uniqBy } from "lodash"

import { config } from "../../config.ts"
import { Artist } from "../BackendModels/Artist.ts"
import { User } from "../BackendModels/User.ts"
import { SpotifyArtist } from "../SpotifyModels/SpotifyArtist.ts"

export async function storeUserFavouriteArtists(user: User, spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  const withoutDuplicates: SpotifyArtist[] = _uniqBy(spotifyArtists, "id")
  const url = `${config.BACKEND_URL}/userFavouriteArtists`

  const result = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user,
      artists: withoutDuplicates
    })
  })

  if (!result.ok) {
    throw new Error("Error while storing userFavouriteArtists")
  }

  return await result.json() as Artist[]
}
