import { useQuery } from "react-query"

import { fetchProfile, getAccessToken, redirectToAuthCodeFlow } from "../../Data/SpotifyApis/InitApi.ts"
import config from "../../config.ts"
import CircularLoader from "../_CommonComponents/CircularLoader.tsx"

import "./HomePage.scss"

const params = new URLSearchParams(window.location.search)
const code = params.get("code")

export default function HomePage() {
  // TODO: remove
  console.log("HomePage")

  if (!code) {
    redirectToAuthCodeFlow(config.SPOTIFY_CLIENT_ID)
    return
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: spotifyAccessToken, isLoading: isSpotifyAccessTokenLoading, isError: isSpotifyAccessTokenError } = useQuery(
    ["spotifyAccessToken", config.SPOTIFY_CLIENT_ID, code],
    () => getAccessToken(config.SPOTIFY_CLIENT_ID, code),
    {
      enabled: !!code,
    }
  )

  // eslint-disable-next-line no-unused-vars,react-hooks/rules-of-hooks
  const { data: spotifyProfile, isLoading: isSpotifyProfileLoading, isError: isSpotifyProfileError } = useQuery(
    ["spotifyProfile", spotifyAccessToken],
    () => fetchProfile(spotifyAccessToken!),
    {
      enabled: !!spotifyAccessToken,
    }
  )

  if (isSpotifyAccessTokenLoading || isSpotifyProfileLoading) {
    return (
      <main>
        <CircularLoader/>
      </main>
    )
  }

  if (isSpotifyAccessTokenError || isSpotifyProfileError) {
    return (
      <main>
        <span>Error fetching data</span>
      </main>
    )
  }

  console.log(spotifyProfile)

  // populateUI(spotifyProfile)

  return (
    <main>
      <p>Home</p>
    </main>
  )
}
