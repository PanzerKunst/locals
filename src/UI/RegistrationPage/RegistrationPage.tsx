import { LocationOn } from "@mui/icons-material"
import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy"
import classNames from "classnames"
import { useAnimate } from "framer-motion"
import _isEmpty from "lodash/isEmpty"
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { FavouriteArtists } from "./FavouriteArtists.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { storeUser } from "../../Data/Backend/Apis/UserApi.ts"
import { storeUserFavouriteArtists } from "../../Data/Backend/Apis/UserFavouriteArtistsApi.ts"
import { fetchFavouriteSpotifyArtists } from "../../Data/FrontendHelperApis/UserFavouriteArtistsApi.ts"
import { searchLocations } from "../../Data/Geoapify/Apis/AutocompleteApi.ts"
import { GeoapifyFeature } from "../../Data/Geoapify/Models/GeoapifyFeature.ts"
import { isSpotifyUserProfileCompatible } from "../../Data/Spotify/Models/SpotifyUserProfile.ts"
import { defaultFadeInDelay, scrollIntoView } from "../../Util/AnimationUtils.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { Field, isEmailValid } from "../../Util/FormUtils.ts"
import { useDebounce } from "../../Util/ReactUtils.ts"
import { getSpotifyProfileFromSession, saveSpotifyProfileInSession } from "../../Util/SessionStorage.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { LocationSelectList } from "../_CommonComponents/LocationSelectList.tsx"
import { ErrorSnackbar } from "../_CommonComponents/Snackbar/ErrorSnackbar.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./RegistrationPage.scss"

const minLocationQueryLength = 3

export function RegistrationPage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const [scope, animate] = useAnimate()
  const spotifyProfile = getSpotifyProfileFromSession()

  if (!spotifyProfile) {
    return renderContents(<ErrorSnackbar message="Profile is missing"/>)
  }

  if (!isSpotifyUserProfileCompatible(spotifyProfile)) {
    return renderContents(<ErrorSnackbar message="Profile is incompatible"/>)
  }

  /* eslint-disable react-hooks/rules-of-hooks */

  const [isStep2Hidden, setIsStep2Hidden] = useState(true)
  const [emailField, setEmailField] = useState<Field>({ value: spotifyProfile.email || "", error: "" })

  const [locationQuery, setLocationQuery] = useState("")
  const debouncedLocationQuery = useDebounce(locationQuery, 300)
  const [locationFieldError, setLocationFieldError] = useState("")
  const [isSearchingLocations, setIsSearchingLocations] = useState(true)
  const [locationSearchResults, setLocationSearchResults] = useState<GeoapifyFeature[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeoapifyFeature>()

  const favouriteSpotifyArtistsQuery = useQuery(
    "favouriteSpotifyArtists",
    () => fetchFavouriteSpotifyArtists(appContext)
  )

  useEffect(() => {
    async function performLocationSearch() {
      setIsSearchingLocations(true)
      const searchResults = await searchLocations(debouncedLocationQuery)
      setIsSearchingLocations(false)
      setLocationSearchResults(searchResults)
    }

    setLocationSearchResults([])

    if (debouncedLocationQuery.length < minLocationQueryLength || selectedLocation) {
      setIsSearchingLocations(false)
      return
    }

    performLocationSearch()
  }, [debouncedLocationQuery, selectedLocation])

  /* eslint-enable react-hooks/rules-of-hooks */

  if (favouriteSpotifyArtistsQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (favouriteSpotifyArtistsQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  function isEmailInputValid(): boolean {
    const email = emailField.value

    if (email === "") {
      setEmailField({ value: email, error: "Cannot be empty" })
      return false
    }

    if (!isEmailValid(email)) {
      setEmailField({ value: email, error: "Invalid email" })
      return false
    }

    return true
  }

  function isLocationInputValid(): boolean {
    if (!selectedLocation) {
      setLocationFieldError("Please select a location")
      return false
    }

    return true
  }

  function isFormValid(): boolean {
    if (!isEmailInputValid()) {
      return false
    }

    return isLocationInputValid()
  }

  const handleStep2Click = () => {
    setIsStep2Hidden(false)
    animate(scope.current, { opacity: 0 }, { duration: Number(s.animationDurationSm) })
    const step2El = document.getElementById("registration-step-2")
    scrollIntoView(step2El, defaultFadeInDelay)
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setEmailField({
      value,
      error: "" // We reset any eventual errors
    })
  }

  const handleEmailBlur = () => {
    return isEmailInputValid()
  }

  const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(event.target.value)
    setSelectedLocation(undefined)
  }

  const handleLocationSelect = (location: GeoapifyFeature) => {
    setSelectedLocation(location)
    setLocationQuery(location.formatted)
    setLocationFieldError("")
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isFormValid()) {
      return
    }

    const user = await storeUser(appContext, {
      ...spotifyProfile!,
      email: emailField.value
    })

    await storeUserFavouriteArtists(user, favouriteSpotifyArtistsQuery.data!)
    saveSpotifyProfileInSession(undefined)
    navigate(`/home?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.REGISTRATION_SUCCESS}`)
  }

  return renderContents(
    <>
      <section id="registration-step-1">
        <FadeIn>
          <h2>Who to follow?</h2>
        </FadeIn>

        <FavouriteArtists spotifyArtists={favouriteSpotifyArtistsQuery.data!}/>

        <FadeIn animationScope={scope} className="wrapper-next-button">
          <AnimatedButton className="filling">
            <button onClick={handleStep2Click}><span>Continue</span></button>
          </AnimatedButton>
        </FadeIn>
      </section>

      <section id="registration-step-2" className={classNames({ "hidden": isStep2Hidden })}>
        <FadeIn>
          <h2>Your details</h2>
        </FadeIn>

        <form noValidate onSubmit={handleFormSubmit}>
          <FadeIn>
            <FormControl error={emailField.error !== ""}>
              <FormLabel>E-mail</FormLabel>
              <Input
                variant="solid"
                size="lg"
                placeholder="chris@hello.net"
                value={emailField.value}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
              />
              {emailField.error !== "" && <FormHelperText>{emailField.error}</FormHelperText>}
            </FormControl>
          </FadeIn>

          <FadeIn>
            <FormControl error={locationFieldError !== ""}>
              <FormLabel>Location</FormLabel>
              <div className="location-input-and-dropdown">
                <Input
                  variant="solid"
                  size="lg"
                  placeholder="Paris, France"
                  value={locationQuery}
                  autoComplete="off"
                  onChange={handleLocationChange}
                  startDecorator={<LocationOn/>}
                />
                {(isSearchingLocations || !_isEmpty(locationSearchResults)) && (
                  <LocationSelectList locations={locationSearchResults} onSelect={handleLocationSelect} isLoading={isSearchingLocations}/>
                )}
              </div>
              {locationFieldError !== "" && <FormHelperText>{locationFieldError}</FormHelperText>}
            </FormControl>
          </FadeIn>

          <FadeIn className="wrapper-next-button">
            <AnimatedButton className="filling">
              <button disabled={emailField.error !== "" || locationFieldError !== ""}>
                <span>Finish registration</span>
              </button>
            </AnimatedButton>
          </FadeIn>
        </form>
      </section>
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
