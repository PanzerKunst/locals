import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy"
import classNames from "classnames"
import { isEmpty as _isEmpty } from "lodash"
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { FavouriteArtists } from "./FavouriteArtists.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { storeUser } from "../../Data/Backend/Apis/UserApi.ts"
import { storeUserFavouriteArtists } from "../../Data/Backend/Apis/UserFavouriteArtistsApi.ts"
import { fetchFavouriteSpotifyArtists } from "../../Data/FrontendHelperApis/UserFavouriteArtistsApi.ts"
import { isSpotifyUserProfileCompatible, SpotifyUserProfile } from "../../Data/Spotify/Models/SpotifyUserProfile.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { Field } from "../../Util/FormUtils.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import "./RegistrationPage.scss"

export function RegistrationPage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const spotifyProfileFromUrl = getUrlQueryParam(appUrlQueryParam.SPOTIFY_PROFILE)
  const isStep2Hidden = useState(true)
  const [emailField, setEmailField] = useState<Field>({ value: "", error: "" })

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

  const handleStep2Click = () => {

  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setEmailField({
      value,
      error: "", // We reset any eventual errors
    })
  }

  const handleFinishRegistration = () => {

  }

  return renderContents(
    <>
      <section id="registration-step-1">
        <FadeIn>
          <h2>Select your favourite artists</h2>
        </FadeIn>

        <FavouriteArtists spotifyArtists={favouriteSpotifyArtistsQuery.data!}/>

        <FadeIn className="wrapper-next-button">
          <AnimatedButton className="filling">
            <button onClick={handleStep2Click}><span>Continue</span></button>
          </AnimatedButton>
        </FadeIn>
      </section>

      <form noValidate id="registration-step-2" className={classNames({ "hidden": !isStep2Hidden})}>
        <FadeIn>
          <h2>Your details</h2>
        </FadeIn>

        <FormControl error={!_isEmpty(emailField.error)}>
          <FormLabel>E-mail</FormLabel>
          <Input placeholder="chris@hello.net" value={emailField.value} onChange={handleEmailChange} />
          {!_isEmpty(emailField.error) && <FormHelperText>{emailField.error}</FormHelperText>}
        </FormControl>

        <FadeIn className="wrapper-next-button">
          <AnimatedButton className="filling">
            <button onClick={handleFinishRegistration} disabled={!_isEmpty(emailField.error)}><span>Finish registration</span></button>
          </AnimatedButton>
        </FadeIn>
      </form>
    </>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page registration">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
