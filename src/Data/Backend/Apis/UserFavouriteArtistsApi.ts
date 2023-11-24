import { uniqBy as _uniqBy } from "lodash"

import { config } from "../../../config.ts"
import { SpotifyArtist } from "../../Spotify/Models/SpotifyArtist.ts"
import { Artist } from "../Models/Artist.ts"
import { User } from "../Models/User.ts"

export async function storeUserFavouriteArtists(user: User, spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  const withoutDuplicates: SpotifyArtist[] = _uniqBy(spotifyArtists, "id")

  // TODO: remove
  console.log("storeUserFavouriteArtists")

  const result = await fetch(`${config.BACKEND_URL}/userFavouriteArtists`, {
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
