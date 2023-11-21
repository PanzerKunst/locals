import { isEmpty as _isEmpty, uniqBy as _uniqBy } from "lodash"
import { ReactNode, useState } from "react"
import { useQuery } from "react-query"

import { FavouriteArtists } from "./FavouriteArtists.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { storeUser } from "../../Data/BackendApis/UserApi.ts"
import { storeUserFavouriteArtists } from "../../Data/BackendApis/UserFavouriteArtistsApi.ts"
import { getAccessToken, redirectToAuthCodeFlow } from "../../Data/SpotifyApis/AuthApi.ts"
import { fetchFollowedArtists } from "../../Data/SpotifyApis/FollowedArtistsApi.ts"
import { fetchProfile } from "../../Data/SpotifyApis/ProfileApi.ts"
import { fetchTopArtists } from "../../Data/SpotifyApis/TopItemsApi.ts"
import { SpotifyArtist } from "../../Data/SpotifyModels/SpotifyArtist.ts"
import { appUrlCode } from "../../Util/AppUrlCodes.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

export function HomePage() {
  const appContext = useAppContext()
  const { spotifyApiAccessToken } = appContext

  const [favouriteArtists, setFavouriteArtists] = useState<SpotifyArtist[]>([])
  const [isLoadingFavouriteArtists, setIsLoadingFavouriteArtists] = useState(false)

  const spotifyApiErrorFromUrl = getUrlQueryParam("error") // /spotify-callback?error=access_denied

  if (spotifyApiErrorFromUrl) {
    document.location.replace(`/?${appUrlCode.SPOTIFY_CALLBACK_ERROR}=${spotifyApiErrorFromUrl}`)
    return undefined
  }

  const spotifyApiCodeFromUrl = getUrlQueryParam("code")

  const shouldRedirectToAuth = !spotifyApiAccessToken && !spotifyApiCodeFromUrl

  if (shouldRedirectToAuth) {
    // TODO: remove
    console.log("HomePage > redirectToAuthCodeFlow")

    redirectToAuthCodeFlow(appContext)
    return undefined
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spotifyAccessTokenQuery = useQuery(
    ["spotifyAccessToken", spotifyApiCodeFromUrl],
    () => getAccessToken(appContext, spotifyApiCodeFromUrl!),
    {
      enabled: !spotifyApiAccessToken && !!spotifyApiCodeFromUrl
    }
  )

  // TODO: only fetch profile if user not yet stored in DB

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spotifyProfileQuery = useQuery(
    "spotifyProfile",
    () => fetchProfile(appContext),
    {
      enabled: !!spotifyApiAccessToken
    }
  )

  if (spotifyAccessTokenQuery.isLoading || spotifyProfileQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (spotifyAccessTokenQuery.isError || spotifyProfileQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  async function getTopArtists(): Promise<SpotifyArtist[]> {
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

  async function getFollowedArtists(): Promise<SpotifyArtist[]> {
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

  const handleStoreUserFavouriteArtistsClick = async () => {
    setIsLoadingFavouriteArtists(true)

    const storedUser = await storeUser(spotifyProfile)
    const topArtists = await getTopArtists()
    const followedArtists = await getFollowedArtists()
    const favourites = _uniqBy([...topArtists, ...followedArtists], "id")
    const storedArtists = await storeUserFavouriteArtists(storedUser, favourites)

    console.log("stored artists", storedArtists)

    setFavouriteArtists(favourites)
    setIsLoadingFavouriteArtists(false)
  }

  const spotifyProfile = spotifyProfileQuery.data!

  console.log("spotifyProfile", spotifyProfile)

  return renderContents(
    <>
      <AnimatedButton className="filling">
        <button onClick={handleStoreUserFavouriteArtistsClick}>
          <span>Fetch my favourite artists</span>
        </button>
      </AnimatedButton>

      {isLoadingFavouriteArtists && <CircularLoader/>}

      {!isLoadingFavouriteArtists && !_isEmpty(favouriteArtists) && (
        <>
          <FadeIn>
            <h2>1. Select your favourite artists</h2>
          </FadeIn>
          <FavouriteArtists spotifyArtists={favouriteArtists}/>
        </>
      )}
    </>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page home">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
