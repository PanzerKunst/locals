import { ReactNode } from "react"
import { useQuery } from "react-query"

import { useAppContext } from "../../AppContext.tsx"
import { fetchUser } from "../../Data/Backend/Apis/UserApi.ts"
import { getAccessToken, redirectToAuthCodeFlow } from "../../Data/Spotify/Apis/AuthApi.ts"
import { fetchProfile } from "../../Data/Spotify/Apis/ProfileApi.ts"
import { SpotifyUserProfile } from "../../Data/Spotify/Models/SpotifyUserProfile.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { saveSpotifyProfileInSessionStorage } from "../../Util/SessionStorage.ts"
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
    return
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spotifyAccessTokenQuery = useQuery(
    ["spotifyAccessToken", spotifyApiCodeFromUrl],
    () => getAccessToken(appContext, spotifyApiCodeFromUrl!),
    {
      enabled: !spotifyApiAccessToken && !!spotifyApiCodeFromUrl
    }
  )

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

  async function checkIfAlreadyRegistered(spotifyProfile: SpotifyUserProfile): Promise<void> {
    console.log("spotifyProfile", spotifyProfile)
    const fetchedUser = await fetchUser(appContext, spotifyProfile)

    if (!fetchedUser) {
      // TODO: remove
      console.log("HomePage > redirecting to /registration")

      saveSpotifyProfileInSessionStorage(spotifyProfile)

      // TODO: try navigate
      document.location.replace("/registration")
    }
  }

  checkIfAlreadyRegistered(spotifyProfileQuery.data!)

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
