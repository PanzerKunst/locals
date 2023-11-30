import _isEmpty from "lodash/isEmpty"
import _uniqBy from "lodash/uniqBy"

import { AppContextType } from "../../AppContext.tsx"
import { fetchFollowedArtists } from "../Spotify/Apis/FollowedArtistsApi.ts"
import { fetchTopArtists } from "../Spotify/Apis/TopItemsApi.ts"
import { SpotifyArtist } from "../Spotify/Models/SpotifyArtist.ts"

export async function fetchFavouriteSpotifyArtists(appContext: AppContextType): Promise<SpotifyArtist[]> {
  const topArtists = await fetchTopSpotifyArtists(appContext)
  const followedArtists = await fetchFollowedSpotifyArtists(appContext)
  return _uniqBy([...topArtists, ...followedArtists], "id")
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

async function fetchFollowedSpotifyArtists(appContext: AppContextType): Promise<SpotifyArtist[]> {
  let idOfLastFetchedArtist: string | undefined = undefined
  const result: SpotifyArtist[] = []

  let fetchedArtists = await fetchFollowedArtists(appContext, idOfLastFetchedArtist)

  while (!_isEmpty(fetchedArtists)) {
    result.push(...fetchedArtists)
    idOfLastFetchedArtist = fetchedArtists.at(-1)?.id
    fetchedArtists = await fetchFollowedArtists(appContext, idOfLastFetchedArtist)
  }

  return result
}
