import { uniqBy as _uniqBy } from "lodash"

import { AppContextType } from "../../AppContext.tsx"
import { config } from "../../config.ts"
import { Artist } from "../BackendModels/Artist.ts"
import { SpotifyArtist } from "../SpotifyModels/SpotifyArtist.ts"

export async function storeUserFavouriteArtists(appContext: AppContextType, spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  const { loggedInUser } = appContext

  if (!loggedInUser) {
    throw new Error("No loggedInUser found in app context")
  }

  const withoutDuplicates: SpotifyArtist[] = _uniqBy(spotifyArtists, "id")
  const url = `${config.BACKEND_URL}/userFavouriteArtists`

  const result = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: loggedInUser,
      artists: withoutDuplicates
    })
  })

  if (!result.ok) {
    throw new Error("Error while storing userFavouriteArtists")
  }

  return await result.json() as Artist[]
}
