import _ from "lodash"
import { MouseEvent, ReactNode, useState } from "react"
import { useQuery } from "react-query"

import { useAppContext } from "../../AppContext.tsx"
import { storeUser } from "../../Data/BackendApis/UserApi.ts"
import { storeUserFavouriteArtists } from "../../Data/BackendApis/UserFavouriteArtistsApi.ts"
import { getAccessToken, redirectToAuthCodeFlow } from "../../Data/SpotifyApis/AuthApi.ts"
import { fetchFollowedArtists } from "../../Data/SpotifyApis/FollowedArtistsApi.ts"
import { fetchProfile } from "../../Data/SpotifyApis/ProfileApi.ts"
import { fetchTopArtists } from "../../Data/SpotifyApis/TopItemsApi.ts"
import { SpotifyArtist } from "../../Data/SpotifyModels/SpotifyArtist.ts"
import { SpotifyMedia } from "../../Data/SpotifyModels/SpotifyMedia.ts"
import { appUrlCode } from "../../Util/AppUrlCodes.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"

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

  function getSpotifyProfileImage(): SpotifyMedia | undefined {
    if (!spotifyProfile || _.isEmpty(spotifyProfile.images)) {
      return undefined
    }

    return spotifyProfile.images.at(-1)
  }

  async function getTopArtists(): Promise<SpotifyArtist[]> {
    let topArtistsPageNb = 0
    const result: SpotifyArtist[] = []

    let fetchedArtists = await fetchTopArtists(appContext, topArtistsPageNb)

    while(!_.isEmpty(fetchedArtists)) {
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

    while(!_.isEmpty(fetchedArtists)) {
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
    const favourites = [...topArtists, ...followedArtists]
    const storedArtists = await storeUserFavouriteArtists(storedUser, favourites)

    console.log("stored artists", storedArtists)

    setFavouriteArtists(favourites)
    setIsLoadingFavouriteArtists(false)
  }

  const handleMouseMove = (event: MouseEvent<HTMLImageElement>) => {
    const img = event.currentTarget

    const { width, height, left, top } = img.getBoundingClientRect()
    const mouseX = event.clientX - (left + width / 2)
    const mouseY = event.clientY - (top + height / 2)
    const rotateX = -(mouseY / height) * 30 // tilt factor
    const rotateY = (mouseX / width) * 30 // tilt factor

    img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = (event: MouseEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    img.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
  }

  const spotifyProfile = spotifyProfileQuery.data!
  const spotifyProfileImage = getSpotifyProfileImage()

  console.log("spotifyProfile", spotifyProfile)

  return renderContents(
    <>
      {spotifyProfile && (
        <section>
          <h1>Logged in as {spotifyProfile.display_name}</h1>
          {spotifyProfileImage && ( // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <img
              src={spotifyProfileImage.url}
              alt="user-avatar"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          )}
          <ul>
            <li>User ID: {spotifyProfile.id}</li>
            <li>Email: {spotifyProfile.email}</li>
            <li>Spotify URI: <a href={spotifyProfile.external_urls.spotify}>{spotifyProfile.external_urls.spotify}</a></li>
            <li>Link: <a href={spotifyProfile.href}>{spotifyProfile.href}</a></li>
          </ul>
        </section>
      )}

      <button onClick={handleStoreUserFavouriteArtistsClick}>Store user favourite artists</button>

      {isLoadingFavouriteArtists && <CircularLoader/>}

      {!isLoadingFavouriteArtists && !_.isEmpty(favouriteArtists) && (
        <>
          <h2>Favourite artists</h2>
          <ul>
            {favouriteArtists.map((artist) => (
              <li key={artist.id}>
                {!_.isEmpty(artist.images) && <img src={artist.images[0]!.url} alt="artist-avatar"/>}
                <span>{artist.name}</span>
              </li>
            ))}
          </ul>
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
