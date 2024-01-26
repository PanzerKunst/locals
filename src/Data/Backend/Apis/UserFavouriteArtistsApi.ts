import _isEmpty from "lodash/isEmpty"
import _uniqBy from "lodash/uniqBy"

import { AppContextType } from "../../../AppContext.tsx"
import { config } from "../../../config.ts"
import { fetchTopArtists } from "../../Spotify/Apis/TopItemsApi.ts"
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

export async function fetchFavouriteSpotifyArtists(appContext: AppContextType): Promise<SpotifyArtist[]> {
  const topArtists = await fetchTopSpotifyArtists(appContext)
  // const followedArtists = await fetchFollowedSpotifyArtists(appContext)
  return _uniqBy([...topArtists/* , ...followedArtists */], "id")
}

async function fetchTopSpotifyArtists(appContext: AppContextType): Promise<SpotifyArtist[]> {
  let topArtistsPageNb = 0
  const result: SpotifyArtist[] = []

  let fetchedArtists = await fetchTopArtists(appContext, topArtistsPageNb)

  while (!_isEmpty(fetchedArtists)) {
    result.push(...fetchedArtists)
    topArtistsPageNb += 1
    fetchedArtists = await fetchTopArtists(appContext, topArtistsPageNb)
  }

  return result
}

/* async function fetchFollowedSpotifyArtists(appContext: AppContextType): Promise<SpotifyArtist[]> {
  let idOfLastFetchedArtist: string | undefined = undefined
  const result: SpotifyArtist[] = []

  let fetchedArtists = await fetchFollowedArtists(appContext, idOfLastFetchedArtist)

  while (!_isEmpty(fetchedArtists)) {
    result.push(...fetchedArtists)
    idOfLastFetchedArtist = fetchedArtists.at(-1)?.id
    fetchedArtists = await fetchFollowedArtists(appContext, idOfLastFetchedArtist)
  }

  return result
} */
