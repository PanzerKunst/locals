import { uniqBy as _uniqBy } from "lodash"

import { AppContextType } from "../../../AppContext.tsx"
import { config } from "../../../config.ts"
import { SpotifyArtist } from "../../Spotify/Models/SpotifyArtist.ts"
import { Artist } from "../Models/Artist.ts"

export async function storeUserFavouriteArtists(appContext: AppContextType, spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  const { loggedInUser } = appContext

  if (!loggedInUser) {
    throw new Error("No loggedInUser found in app context")
  }

  const withoutDuplicates: SpotifyArtist[] = _uniqBy(spotifyArtists, "id")

  const result = await fetch(`${config.BACKEND_URL}/userFavouriteArtists`, {
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
