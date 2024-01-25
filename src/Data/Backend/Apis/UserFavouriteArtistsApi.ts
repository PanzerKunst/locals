import { config } from "../../../config.ts"
import { SpotifyArtist } from "../../Spotify/Models/SpotifyArtist.ts"
import { Artist } from "../Models/Artist.ts"
import { User } from "../Models/User.ts"

export async function storeFavouriteArtists(user: User, favouriteArtists: Artist[], followedArtists: SpotifyArtist[]): Promise<Artist[]> {
  const result = await fetch(`${config.BACKEND_URL}/favouriteArtists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user,
      favouriteArtists,
      followedArtists
    })
  })

  if (!result.ok) {
    throw new Error("Error while storing userFavouriteArtists")
  }

  return await result.json() as Artist[]
}

export async function updateFollowedArtists(user: User, followedArtists: Artist[]): Promise<Artist[]> {
  const result = await fetch(`${config.BACKEND_URL}/followedArtists`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user,
      followedArtists
    })
  })

  if (!result.ok) {
    throw new Error("Error while updating followed artists")
  }

  return await result.json() as Artist[]
}
