import { ReactNode, useEffect } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"
import { fetchUser } from "../../Data/Backend/Apis/UserApi.ts"
import { getAccessToken, redirectToAuthCodeFlow } from "../../Data/Spotify/Apis/AuthApi.ts"
import { fetchProfile } from "../../Data/Spotify/Apis/ProfileApi.ts"
import { SpotifyUserProfile } from "../../Data/Spotify/Models/SpotifyUserProfile.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

export function HomePage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const { spotifyApiAccessToken } = appContext

  const spotifyApiErrorFromUrl = getUrlQueryParam("error") // /spotify-callback?error=access_denied

  if (spotifyApiErrorFromUrl) {
    navigate(`/?${appUrlQueryParam.SPOTIFY_CALLBACK_ERROR}=${spotifyApiErrorFromUrl}`, { replace: true })
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spotifyProfileQuery = useQuery(
    "spotifyProfile",
    () => fetchProfile(appContext),
    {
      enabled: !!spotifyApiAccessToken
    }
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    async function checkIfAlreadyRegistered(spotifyProfile: SpotifyUserProfile): Promise<void> {
      console.log("spotifyProfile", spotifyProfile)
      const fetchedUser = await fetchUser(appContext, spotifyProfile)

      if (!fetchedUser) {
        // TODO: remove
        console.log("HomePage > redirecting to /registration-step-1")

        const spotifyProfileUrlParam = encodeURIComponent(JSON.stringify(spotifyProfile))
        navigate(`/registration-step-1?${appUrlQueryParam.SPOTIFY_PROFILE}=${spotifyProfileUrlParam}`, { replace: true })
      }
    }

    console.log("Homepage > useEffect")

    if (spotifyProfileQuery.data) {
      checkIfAlreadyRegistered(spotifyProfileQuery.data)
    }
    // Omitting `appContext` in the dependencies avoids an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyProfileQuery.data])

  if (spotifyAccessTokenQuery.isError || spotifyProfileQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  // TODO: remove
  console.log("HomePage > render")

  return renderContents(
    <FadeIn>
      <h1>Welcome back!</h1>
    </FadeIn>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page registration-step-1">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
