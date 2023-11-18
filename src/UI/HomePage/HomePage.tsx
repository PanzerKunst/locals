import { MouseEvent, ReactNode, useState } from "react"
import { useQuery } from "react-query"

import { useAppContext } from "../../AppContext.tsx"
import { storeUserFavouriteArtists } from "../../Data/BackendApis/ArtistApi.ts"
import { getAccessToken, redirectToAuthCodeFlow } from "../../Data/SpotifyApis/AuthApi.ts"
import { fetchFollowedArtists } from "../../Data/SpotifyApis/FollowedArtistsApi.ts"
import { fetchProfile } from "../../Data/SpotifyApis/ProfileApi.ts"
import { fetchTopArtists } from "../../Data/SpotifyApis/TopItemsApi.ts"
import { SpotifyArtist } from "../../Data/SpotifyModels/SpotifyArtist.ts"
import { SpotifyMedia } from "../../Data/SpotifyModels/SpotifyMedia.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"

export function HomePage() {
  const appContext = useAppContext()
  const { spotifyApiAccessToken } = appContext

  const [topArtistsPageNb, setTopArtistsPageNb] = useState(0)
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([])
  const [followedArtists, setFollowedArtists] = useState<SpotifyArtist[]>([])

  const spotifyApiCodeFromUrl = new URLSearchParams(window.location.search).get("code")
  const spotifyApiErrorFromUrl = new URLSearchParams(window.location.search).get("error") // /spotify-callback?error=access_denied

  if (spotifyApiErrorFromUrl) {
    document.location.replace("/?alert=spotifyAccessDenied") // TODO
    return undefined
  }

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
    if (!spotifyProfile || spotifyProfile.images.length === 0) {
      return undefined
    }

    return spotifyProfile.images.at(-1)
  }

  const handleTopArtistsClick = async () => {
    const artists = await fetchTopArtists(appContext, topArtistsPageNb)

    setTopArtists([
      ...topArtists,
      ...artists
    ])

    setTopArtistsPageNb(topArtistsPageNb + 1)
  }

  const handleFollowedArtistsClick = async () => {
    const artists = await fetchFollowedArtists(appContext, followedArtists.at(-1)?.id)

    setFollowedArtists([
      ...followedArtists,
      ...artists
    ])
  }

  const handleStoreUserFavouriteArtistsClick = async () => {
    const artists = [...topArtists, ...followedArtists]
    const storedArtists = await storeUserFavouriteArtists(spotifyProfile, artists)

    console.log("stored artists", storedArtists)
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

  const favouriteArtists = [...topArtists, ...followedArtists]

  console.log("spotifyProfile", spotifyProfile)
  console.log("favouriteArtists", favouriteArtists)
  console.log("total artists", favouriteArtists.length)

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

      {topArtists.length > 0 && (
        <>
          <h2>Top artists</h2>
          <ul>
            {topArtists.map((artist) => (
              <li key={artist.id}>
                {artist.images.length > 0 && <img src={artist.images[0]!.url} alt="artist-avatar"/>}
                <span>{artist.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {followedArtists.length > 0 && (
        <>
          <h2>Followed artists</h2>
          <ul>
            {followedArtists.map((artist) => (
              <li key={artist.id}>
                {artist.images.length > 0 && <img src={artist.images[0]!.url} alt="artist-avatar"/>}
                <span>{artist.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <button onClick={handleTopArtistsClick}>Fetch top artists</button>
      <button onClick={handleFollowedArtistsClick}>Fetch followed artists</button>
      <button onClick={handleStoreUserFavouriteArtistsClick}>Store user favourite artists</button>
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
