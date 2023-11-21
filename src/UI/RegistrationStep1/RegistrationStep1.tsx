import { ReactNode, useEffect, useMemo } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { FavouriteArtists } from "./FavouriteArtists.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { storeUser } from "../../Data/BackendApis/UserApi.ts"
import { storeUserFavouriteArtists } from "../../Data/BackendApis/UserFavouriteArtistsApi.ts"
import { fetchFavouriteSpotifyArtists } from "../../Data/FrontendHelperApis/UserFavouriteArtistsApi.ts"
import { isSpotifyUserProfileCompatible, SpotifyUserProfile } from "../../Data/SpotifyModels/SpotifyUserProfile.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

export function RegistrationStep1() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const spotifyProfileFromUrl = getUrlQueryParam(appUrlQueryParam.SPOTIFY_PROFILE)

  if (!spotifyProfileFromUrl) {
    navigate(`/?${appUrlQueryParam.SPOTIFY_PROFILE_ERROR}=Profile is missing`, { replace: true })
  }

  const spotifyProfile: SpotifyUserProfile = useMemo(() => JSON.parse(spotifyProfileFromUrl!), [spotifyProfileFromUrl])

  if (!isSpotifyUserProfileCompatible(spotifyProfile)) {
    navigate(`/?${appUrlQueryParam.SPOTIFY_PROFILE_ERROR}=Profile is incompatible`, { replace: true })
  }

  useEffect(() => {
    storeUser(appContext, spotifyProfile)
    // Omitting `appContext` in the dependencies avoids an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyProfile])

  const favouriteSpotifyArtistsQuery = useQuery(
    "favouriteSpotifyArtists",
    () => fetchFavouriteSpotifyArtists(appContext)
  )

  useEffect(() => {
    const favouriteArtists = favouriteSpotifyArtistsQuery.data

    if (favouriteArtists) {
      // TODO: remove
      console.log("favouriteArtists", favouriteArtists)

      storeUserFavouriteArtists(appContext, favouriteArtists)
    }
  }, [appContext, favouriteSpotifyArtistsQuery.data])

  if (favouriteSpotifyArtistsQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (favouriteSpotifyArtistsQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  return renderContents(
    <>
      <FadeIn>
        <h2>1. Select your favourite artists</h2>
      </FadeIn>

      <FavouriteArtists spotifyArtists={favouriteSpotifyArtistsQuery.data!}/>
    </>
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
