import { ReactNode } from "react"
import { useQuery } from "react-query"

import { useAppContext } from "../../AppContext.tsx"
import { fetchUser } from "../../Data/Backend/Apis/UserApi.ts"
import { getAccessToken, redirectToAuthCodeFlow } from "../../Data/Spotify/Apis/AuthApi.ts"
import { fetchProfile } from "../../Data/Spotify/Apis/ProfileApi.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { saveSpotifyProfileInSession } from "../../Util/SessionStorage.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { ErrorSnackbar } from "../_CommonComponents/Snackbar/ErrorSnackbar.tsx"

export function HomePage() {
  const appContext = useAppContext()
  const { spotifyApiAccessToken } = appContext

  const spotifyApiErrorFromUrl = getUrlQueryParam("error") // /spotify-callback?error=access_denied

  if (spotifyApiErrorFromUrl) {
    return renderContents(<ErrorSnackbar message={`Spotify API error: "${spotifyApiErrorFromUrl}"`}/>)
  }

  const spotifyApiCodeFromUrl = getUrlQueryParam("code")

  const shouldRedirectToAuth = !spotifyApiAccessToken && !spotifyApiCodeFromUrl

  if (shouldRedirectToAuth) {
    // TODO: remove
    console.log("HomePage > redirectToAuthCodeFlow")

    redirectToAuthCodeFlow(appContext)
    return renderContents(<></>)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spotifyAccessTokenQuery = useQuery(
    ["spotifyAccessToken", appContext, spotifyApiCodeFromUrl],
    () => getAccessToken(appContext, spotifyApiCodeFromUrl!),
    {
      enabled: !spotifyApiAccessToken && !!spotifyApiCodeFromUrl
    }
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spotifyProfileQuery = useQuery(
    ["spotifyProfile", appContext],
    () => fetchProfile(appContext),
    {
      enabled: !!spotifyApiAccessToken
    }
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const userQuery = useQuery(
    ["user", appContext, spotifyProfileQuery.data],
    () => fetchUser(appContext, spotifyProfileQuery.data!),
    {
      enabled: !!spotifyProfileQuery.data
    }
  )

  if (spotifyAccessTokenQuery.isLoading || spotifyProfileQuery.isLoading || userQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (spotifyAccessTokenQuery.isError || spotifyProfileQuery.isError || userQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  if (!userQuery.data) {
    saveSpotifyProfileInSession(spotifyProfileQuery.data!)

    // TODO: remove
    console.log("HomePage > redirecting to /registration")

    document.location.replace("/registration")
    return renderContents(<></>)
  }

  return renderContents(
    <FadeIn>
      <h1>Welcome back!</h1>
    </FadeIn>
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
