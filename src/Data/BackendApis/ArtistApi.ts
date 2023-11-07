import _ from "lodash"

import { config } from "../../config.ts"
import { Artist } from "../BackendModels/Artist.ts"
import { SpotifyArtist } from "../SpotifyModels/SpotifyArtist.ts"

export async function storeArtists(artists: SpotifyArtist[]): Promise<Artist[]> {
  const withoutDuplicates: SpotifyArtist[] = _.uniqBy(artists, "id")

  const url = `${config.BACKEND_URL}/artists`

  const result = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(withoutDuplicates)
  })

  if (!result.ok) {
    throw new Error("Error while storing artists")
  }

  return await result.json() as Artist[]
}
