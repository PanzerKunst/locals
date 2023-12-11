import { ReactNode } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"

import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { SuccessSnackbar } from "./_CommonComponents/Snackbar/SuccessSnackbar.tsx"
import { useAppContext } from "../AppContext.tsx"
import { fetchUser } from "../Data/Backend/Apis/UsersApi.ts"
import { getAccessToken, redirectToAuthCodeFlow } from "../Data/Spotify/Apis/AuthApi.ts"
import { fetchProfile } from "../Data/Spotify/Apis/ProfileApi.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../Util/BrowserUtils.ts"
import { saveSpotifyProfileInSession } from "../Util/SessionStorage.ts"

export function HomePage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const { spotifyApiAccessToken, loggedInUser } = appContext

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

  const actionFromUrl = getUrlQueryParam(appUrlQueryParam.ACTION)

  return renderContents(
    <>
      {actionFromUrl === actionsFromAppUrl.PUBLICATION_SUCCESS && (
        <SuccessSnackbar>
          <span>Your post is now published</span>
          <p><Link to="/post" className="underlined disappears">Check it out</Link></p>
        </SuccessSnackbar>
      )}

      <FadeIn>
        <h1>Welcome back, {loggedInUser?.name}!</h1>
      </FadeIn>
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
