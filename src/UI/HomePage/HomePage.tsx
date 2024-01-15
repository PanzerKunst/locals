import { ReactNode } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { HomepageContent } from "./HomepageContent.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { fetchUser } from "../../Data/Backend/Apis/UsersApi.ts"
import { getAccessToken, redirectToAuthCodeFlow } from "../../Data/Spotify/Apis/AuthApi.ts"
import { fetchProfile } from "../../Data/Spotify/Apis/ProfileApi.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { saveSpotifyProfileInSession } from "../../Util/SessionStorage.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"

export function HomePage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const { spotifyApiAccessToken } = appContext

  const spotifyApiErrorFromUrl = getUrlQueryParam(appUrlQueryParam.SPOTIFY_CALLBACK_ERROR) // /spotify-callback?error=access_denied

  if (spotifyApiErrorFromUrl) {
    // `navigate` doesn't work here
    document.location.replace(`/?${appUrlQueryParam.SPOTIFY_CALLBACK_ERROR}=${spotifyApiErrorFromUrl}`)
    return renderContents(<></>)
  }

  const spotifyApiCodeFromUrl = getUrlQueryParam(appUrlQueryParam.SPOTIFY_CALLBACK_CODE)

  const shouldRedirectToAuth = !spotifyApiAccessToken && !spotifyApiCodeFromUrl

  if (shouldRedirectToAuth) {
    // TODO: remove
    console.log("HomePage > redirectToAuthCodeFlow")

    void redirectToAuthCodeFlow(appContext)
    return renderContents(<></>)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spotifyAccessTokenQuery = useQuery(
    "spotifyAccessToken",
    () => getAccessToken(appContext, spotifyApiCodeFromUrl!),
    { enabled: !spotifyApiAccessToken && !!spotifyApiCodeFromUrl }
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spotifyProfileQuery = useQuery(
    "spotifyProfile",
    () => fetchProfile(appContext),
    { enabled: !!spotifyApiAccessToken }
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const userQuery = useQuery(
    "user",
    () => fetchUser(appContext, spotifyProfileQuery.data!),
    { enabled: !!spotifyProfileQuery.data }
  )

  if (spotifyAccessTokenQuery.isLoading || spotifyProfileQuery.isLoading || userQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (spotifyAccessTokenQuery.isError || spotifyProfileQuery.isError || userQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  if (!userQuery.data) {
    saveSpotifyProfileInSession(spotifyProfileQuery.data)

    // TODO: remove
    console.log("HomePage > redirecting to /register")

    navigate("/register", { replace: true })
    return renderContents(<></>)
  }

  return renderContents(<HomepageContent/>)

  function renderContents(children: ReactNode) {
    return (
      <div className="page home no-top-margin-on-mobile">
        <main>
          {children}
        </main>
      </div>
    )
  }
}
