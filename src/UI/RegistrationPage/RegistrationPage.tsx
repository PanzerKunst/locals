import { LocationOn } from "@mui/icons-material"
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
import { searchLocations } from "../../Data/Geoapify/Apis/AutocompleteApi.ts"
import { GeoapifyFeature } from "../../Data/Geoapify/Models/GeoapifyFeature.ts"
import { isSpotifyUserProfileCompatible, SpotifyUserProfile } from "../../Data/Spotify/Models/SpotifyUserProfile.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { Field, isEmailValid } from "../../Util/FormUtils.ts"
import { useDebounce } from "../../Util/ReactUtils.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { LocationSelectList } from "../_CommonComponents/LocationSelectList.tsx"

import "./RegistrationPage.scss"

const minLocationQueryLength = 3

export function RegistrationPage() {
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

  const [isStep2Hidden, setIsStep2Hidden] = useState(true)
  const [emailField, setEmailField] = useState<Field>({ value: spotifyProfile.email, error: "" })

  const [locationQuery, setLocationQuery] = useState("")
  const debouncedLocationQuery = useDebounce(locationQuery, 300)
  const [locationFieldError, setLocationFieldError] = useState("")
  const [isSearchingLocations, setIsSearchingLocations] = useState(true)
  const [locationSearchResults, setLocationSearchResults] = useState<GeoapifyFeature[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeoapifyFeature>()

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

  useEffect(() => {
    const performLocationSearch = async () => {
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
    // TODO: scroll down to step 2
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
    // TODO: remove
    console.log("handleLocationChange", event.target.value)

    setLocationQuery(event.target.value)
    setSelectedLocation(undefined)
  }

  const handleLocationSelect = (location: GeoapifyFeature) => {
    // TODO: remove
    console.log("handleLocationSelect", location)

    setSelectedLocation(location)
    setLocationQuery(location.formatted)
    setLocationFieldError("")
  }

  const handleFormSubmit = () => {
    const isValid = isFormValid()
    if (!isValid) return

    // TODO
  }

  return renderContents(
    <>
      <section id="registration-step-1">
        <FadeIn>
          <h2>Select your favourite artists</h2>
        </FadeIn>

        <FavouriteArtists spotifyArtists={favouriteSpotifyArtistsQuery.data!}/>

        <FadeIn className={classNames("wrapper-next-button", { hidden: !isStep2Hidden })}>
          <AnimatedButton className="filling">
            <button onClick={handleStep2Click}><span>Continue</span></button>
          </AnimatedButton>
        </FadeIn>
      </section>

      <form noValidate id="registration-step-2" className={classNames({ "hidden": isStep2Hidden })}>
        <FadeIn>
          <h2>Your details</h2>
        </FadeIn>

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
          <FormControl error={locationFieldError !== ""} className="location-form-control">
            <FormLabel>Location</FormLabel>
            <Input
              variant="solid"
              size="lg"
              placeholder="Paris, France"
              value={locationQuery}
              autoComplete="off"
              onChange={handleLocationChange}
              startDecorator={<LocationOn/>}
            />
            {locationFieldError !== "" && <FormHelperText>{locationFieldError}</FormHelperText>}

            {(isSearchingLocations || !_isEmpty(locationSearchResults)) && (
              <LocationSelectList locations={locationSearchResults} onSelect={handleLocationSelect} isLoading={isSearchingLocations}/>
            )}
          </FormControl>
        </FadeIn>

        <FadeIn className="wrapper-next-button">
          <AnimatedButton className="filling">
            <button
              onClick={handleFormSubmit}
              disabled={emailField.error !== "" || locationFieldError !== ""}
            >
              <span>Finish registration</span>
            </button>
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
