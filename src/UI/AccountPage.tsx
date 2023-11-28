export function AccountPage() {
  return undefined

  /* const appContext = useAppContext()
  const { loggedInUser } = appContext

  if (!loggedInUser) {
    return renderContents(<ErrorSnackbar message="User is missing"/>)
  }

  const [emailField, setEmailField] = useState<Field>({ value: loggedInUser.email, error: "" })

  const [locationQuery, setLocationQuery] = useState("")
  const debouncedLocationQuery = useDebounce(locationQuery, 300)
  const [locationFieldError, setLocationFieldError] = useState("")
  const [isSearchingLocations, setIsSearchingLocations] = useState(false)
  const [locationSearchResults, setLocationSearchResults] = useState<GeoapifyFeature[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeoapifyFeature>()

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

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isFormValid()) {
      return
    }

    await updateUser(appContext, {
      ...loggedInUser,
      email: emailField.value
    })
  }

  return renderContents(
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
          <div className="location-input-and-dropdown">
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
            {(isSearchingLocations || !_isEmpty(locationSearchResults)) && (
              <LocationSelectList locations={locationSearchResults} onSelect={handleLocationSelect} loading={isSearchingLocations}/>
            )}
          </div>
          {locationFieldError !== "" && <FormHelperText>{locationFieldError}</FormHelperText>}
        </FormControl>
      </FadeIn>

      <FadeIn className="wrapper-next-button">
        <AnimatedButton className="filling">
          <button disabled={emailField.error !== "" || usernameFieldError !== "" || locationFieldError !== ""}>
            <span>Finish registration</span>
          </button>
        </AnimatedButton>
      </FadeIn>
    </form>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page registration">
        <main className="container">
          <FadeIn>
            <h1>Your account</h1>
          </FadeIn>

          {children}
        </main>
      </div>
    )
  } */
}
