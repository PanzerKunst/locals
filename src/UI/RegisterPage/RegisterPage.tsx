import { LocationOn } from "@mui/icons-material"
import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy"
import classNames from "classnames"
import { useAnimate } from "framer-motion"
import _uniqBy from "lodash/uniqBy"
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { FavouriteArtists } from "./FavouriteArtists.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { storeUserFavouriteArtists } from "../../Data/Backend/Apis/UserFavouriteArtistsApi.ts"
import { fetchFavouriteSpotifyArtists } from "../../Data/FrontendHelperApis/UserFavouriteArtistsApi.ts"
import { searchLocations } from "../../Data/Geoapify/Apis/AutocompleteApi.ts"
import { GeoapifyFeature } from "../../Data/Geoapify/Models/GeoapifyFeature.ts"
import { SpotifyArtist } from "../../Data/Spotify/Models/SpotifyArtist.ts"
import { isSpotifyUserProfileCompatible } from "../../Data/Spotify/Models/SpotifyUserProfile.ts"
import { defaultFadeInDelay, scrollIntoView } from "../../Util/AnimationUtils.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { Field, isEmailValid, isUsernameValid } from "../../Util/FormUtils.ts"
import { useDebounce } from "../../Util/ReactUtils.ts"
import { getSpotifyProfileFromSession, saveSpotifyProfileInSession } from "../../Util/SessionStorage.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "../_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { SelectList } from "../_CommonComponents/SelectList.tsx"
import { ErrorSnackbar } from "../_CommonComponents/Snackbar/ErrorSnackbar.tsx"
import { checkUsernameAvailability, storeUser } from "../../Data/Backend/Apis/UsersApi.ts"
import { storeArtists } from "../../Data/Backend/Apis/ArtistsApi.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./RegisterPage.scss"

const minLocationQueryLength = 3

export function RegisterPage() {
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
  const [emailField, setEmailField] = useState<Field>({ value: spotifyProfile.email, error: "" })

  const [username, setUsername] = useState(spotifyProfile.id)
  const debouncedUsername = useDebounce(username, 300)
  const [usernameFieldError, setUsernameFieldError] = useState("")
  const [isCheckingUsernameAvailability, setIsCheckingUsernameAvailability] = useState(false)

  const [locationQuery, setLocationQuery] = useState("")
  const debouncedLocationQuery = useDebounce(locationQuery, 300)
  const [locationFieldError, setLocationFieldError] = useState("")
  const [isSearchingLocations, setIsSearchingLocations] = useState(false)
  const [locationSearchResults, setLocationSearchResults] = useState<GeoapifyFeature[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeoapifyFeature>()

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const [favouriteArtists, setFavouriteArtists] = useState<SpotifyArtist[]>([])
  const [followedArtists, setFollowedArtists] = useState<SpotifyArtist[]>([])

  const favouriteSpotifyArtistsQuery = useQuery(
    "favouriteSpotifyArtists",
    () => fetchFavouriteSpotifyArtists(appContext)
  )

  useEffect(() => {
    const favourites = _uniqBy(favouriteSpotifyArtistsQuery.data || [], "id")
    setFavouriteArtists(favourites)
    setFollowedArtists(favourites)
  },
  [favouriteSpotifyArtistsQuery.data]
  )

  useEffect(() => {
    async function performLocationSearch() {

      // TODO: remove
      console.log("performLocationSearch()")

      setIsSearchingLocations(true)
      const searchResults = await searchLocations(debouncedLocationQuery)
      setIsSearchingLocations(false)
      setLocationSearchResults(searchResults)

      // TODO: remove
      console.log("setLocationSearchResults(searchResults)")
    }

    setLocationSearchResults([])

    // TODO: remove
    console.log("setLocationSearchResults([])", debouncedLocationQuery.length, selectedLocation)

    if (debouncedLocationQuery.length < minLocationQueryLength || selectedLocation) {

      // TODO: remove
      console.log("debouncedLocationQuery.length < minLocationQueryLength || selectedLocation")

      setIsSearchingLocations(false)
      return
    }

    performLocationSearch()
  }, [debouncedLocationQuery, selectedLocation])

  useEffect(() => {
    async function performUsernameAvailabilityCheck() {
      setIsCheckingUsernameAvailability(true)
      const isAvailable = await checkUsernameAvailability(debouncedUsername)
      setIsCheckingUsernameAvailability(false)
      setUsernameFieldError(isAvailable ? "" : "Username is not available")
    }

    setUsernameFieldError("")

    if (!isUsernameInputValid()) {
      setIsCheckingUsernameAvailability(false)
      return
    }

    performUsernameAvailabilityCheck()
  }, [debouncedUsername]) // eslint-disable-line react-hooks/exhaustive-deps

  /* eslint-enable react-hooks/rules-of-hooks */

  if (favouriteSpotifyArtistsQuery.isLoading) {
    return renderContents(
      <>
        <p className="fetching-message centered-contents">Fetching your favourite artists</p>
        <CircularLoader/>
      </>
    )
  }

  if (favouriteSpotifyArtistsQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  function isEmailInputValid(): boolean {
    const email = emailField.value

    if (email === "") {
      setEmailField({ value: email, error: "Please input your email" })
      return false
    }

    if (!isEmailValid(email)) {
      setEmailField({ value: email, error: "Invalid email, sorry" })
      return false
    }

    return true
  }

  function isUsernameInputValid(): boolean {
    if (debouncedUsername === "") {
      setUsernameFieldError("Please input your username")
      return false
    }

    if (!isUsernameValid(debouncedUsername)) {
      setUsernameFieldError("A combination of letters, numbers, -, _, .")
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
    return isEmailInputValid() && isUsernameInputValid() && isLocationInputValid()
  }

  const handleToggleFollowing = (spotifyArtist: SpotifyArtist) => {
    const isAlreadyInList = followedArtists.some(artist => artist.id === spotifyArtist.id)

    const updatedArtists = isAlreadyInList
      ? followedArtists.filter(artist => artist.id !== spotifyArtist.id)
      : [...followedArtists, spotifyArtist]

    setFollowedArtists(updatedArtists)
  }

  const handleStep2Click = () => {
    setIsStep2Hidden(false)
    animate(scope.current, { opacity: 0 }, { duration: Number(s.animationDurationSm) })
    const step2El = document.querySelector("#register-step-2")
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
    isEmailInputValid()
  }

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
    // Error reset done in `useEffect`
  }

  const handleUsernameBlur = () => {
    isUsernameInputValid()
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

    setIsSubmittingForm(true)

    const user = await storeUser(appContext, {
      ...spotifyProfile,
      email: emailField.value
    }, debouncedUsername, selectedLocation!)

    const storedArtistsWithGenres = await storeArtists(favouriteArtists)
    const storedArtists = storedArtistsWithGenres.map((artistWithGenres) => artistWithGenres.artist)
    await storeUserFavouriteArtists(user, storedArtists, followedArtists)
    saveSpotifyProfileInSession(undefined)
    navigate(`/home?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.REGISTRATION_SUCCESS}`)
  }

  return renderContents(
    <>
      <section id="register-step-1">
        <FadeIn>
          <h2>Whom to follow?</h2>
        </FadeIn>

        <FavouriteArtists favouriteArtists={favouriteArtists} followedArtists={followedArtists} onToggle={handleToggleFollowing}/>

        <FadeIn animationScope={scope} className="wrapper-next-button">
          <AnimatedButton className="filling">
            <button className="button" onClick={handleStep2Click}><span>Continue</span></button>
          </AnimatedButton>
        </FadeIn>
      </section>

      <section id="register-step-2" className={classNames({ "hidden": isStep2Hidden })}>
        <FadeIn>
          <h2>Your account</h2>
        </FadeIn>

        <form noValidate onSubmit={handleFormSubmit}>
          <FadeIn>
            <FormControl error={emailField.error !== ""}>
              <FormLabel>E-mail</FormLabel>
              <Input
                variant="soft"
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
            <FormControl error={usernameFieldError !== ""}>
              <FormLabel>Username</FormLabel>
              <Input
                variant="soft"
                size="lg"
                placeholder="MusicLover96"
                value={username}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                endDecorator={isCheckingUsernameAvailability && <CircularLoader/>}
              />
              {usernameFieldError !== "" && <FormHelperText>{usernameFieldError}</FormHelperText>}
            </FormControl>
          </FadeIn>

          <FadeIn>
            <FormControl error={locationFieldError !== ""}>
              <FormLabel>Location</FormLabel>
              <div className="input-and-select-list-wrapper">
                <Input
                  type="text"
                  variant="soft"
                  size="lg"
                  placeholder="Paris, France"
                  value={locationQuery}
                  autoComplete="search"
                  onChange={handleLocationChange}
                  startDecorator={<LocationOn/>}
                />
                <SelectList
                  items={locationSearchResults}
                  renderItem={(location) => location.formatted}
                  onSelect={handleLocationSelect}
                  loading={isSearchingLocations}
                />
              </div>
              {locationFieldError !== "" && <FormHelperText>{locationFieldError}</FormHelperText>}
            </FormControl>
          </FadeIn>

          <FadeIn className="wrapper-next-button">
            <AnimatedButton className="filling">
              <button
                className={classNames("button", { "filling loading": isSubmittingForm })}
                disabled={emailField.error !== "" || usernameFieldError !== "" || locationFieldError !== ""}
              >
                {isSubmittingForm && <ButtonLoader/>}
                <span>Complete registration</span>
              </button>
            </AnimatedButton>
          </FadeIn>
        </form>
      </section>
    </>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page register">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
