import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { SpotifyArtist } from "../../Spotify/Models/SpotifyArtist.ts"
import { Artist } from "../Models/Artist.ts"
import { ArtistWithGenres } from "../Models/ArtistWithGenres.ts"

/* TODO: remove?
export async function fetchArtists(spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  const queryParams = { spotifyIds: spotifyArtists.map((artist) => artist.id) }

  const result = await fetch(`${config.SPOTIFY_API_URL}/artists?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while fetching artists")
  }

  return await result.json() as Artist[]
} */

export async function storeArtists(spotifyArtists: SpotifyArtist[]): Promise<ArtistWithGenres[]> {
  const result = await fetch(`${config.BACKEND_URL}/artists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spotifyArtists})
  })

  if (!result.ok) {
    throw new Error("Error while storing artists")
  }

  return await result.json() as ArtistWithGenres[]
}

export async function fetchArtistOfTagName(tagName: string): Promise<Artist | undefined> {
  const result = await fetch(`${config.BACKEND_URL}/artist/tag/${tagName}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching artist of tag ${tagName}`)
  }

  return result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as Artist
}