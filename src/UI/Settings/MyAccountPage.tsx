import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy"
import classNames from "classnames"
import { ChangeEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"
import { checkEmailAvailability, checkUsernameAvailability, updateUser } from "../../Data/Backend/Apis/UsersApi.ts"
import { AppUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { scrollIntoView } from "../../Util/BrowserUtils.ts"
import { useDebounce } from "../../Util/ReactUtils.ts"
import { Field, isValidEmail, isValidUsername } from "../../Util/ValidationUtils.ts"
import { ButtonLoader } from "../_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { BottomRightInfoSnackbar } from "../_CommonComponents/Snackbar/BottomRightInfoSnackbar.tsx"

import "./MyAccountPage.scss"

export function MyAccountPage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const loggedInUser = appContext.loggedInUser?.user

  const [nameField, setNameField] = useState<Field>({ value: loggedInUser?.name || "", error: "" })

  const [email, setEmail] = useState(loggedInUser?.email || "")
  const debouncedEmail = useDebounce(email, 300)
  const [emailFieldError, setEmailFieldError] = useState("")
  const [isCheckingEmailAvailability, setIsCheckingEmailAvailability] = useState(false)

  const [username, setUsername] = useState(loggedInUser?.username || "")
  const debouncedUsername = useDebounce(username, 300)
  const [usernameFieldError, setUsernameFieldError] = useState("")
  const [isCheckingUsernameAvailability, setIsCheckingUsernameAvailability] = useState(false)

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const [hasSaved, setHasSaved] = useState(false)

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  useEffect(() => {
    async function performEmailAvailabilityCheck() {
      setIsCheckingEmailAvailability(true)
      const isAvailable = await checkEmailAvailability(debouncedEmail)
      setIsCheckingEmailAvailability(false)
      setEmailFieldError(isAvailable ? "" : "Email is not available")
    }

    setEmailFieldError("")

    if (!isEmailFieldValid() || debouncedEmail === loggedInUser?.email) {
      setIsCheckingEmailAvailability(false)
      return
    }

    void performEmailAvailabilityCheck()
  }, [debouncedEmail]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function performUsernameAvailabilityCheck() {
      setIsCheckingUsernameAvailability(true)
      const isAvailable = await checkUsernameAvailability(debouncedUsername)
      setIsCheckingUsernameAvailability(false)
      setUsernameFieldError(isAvailable ? "" : "Username is not available")
    }

    setUsernameFieldError("")

    if (!isUsernameFieldValid() || debouncedUsername === loggedInUser?.username) {
      setIsCheckingUsernameAvailability(false)
      return
    }

    void performUsernameAvailabilityCheck()
  }, [debouncedUsername]) // eslint-disable-line react-hooks/exhaustive-deps

  function isNameFieldValid(): boolean {
    const name = nameField.value

    if (name === "") {
      setNameField({ value: name, error: "Please input your name" })
      scrollIntoView(document.querySelector("#name"))
      return false
    }

    return true
  }

  function isEmailFieldValid(): boolean {
    if (debouncedEmail === "") {
      setEmailFieldError("Please input your email address")
      scrollIntoView(document.querySelector("#email"))
      return false
    }

    if (!isValidEmail(debouncedEmail)) {
      setEmailFieldError("Invalid email, sorry")
      scrollIntoView(document.querySelector("#email"))
      return false
    }

    return true
  }

  function isUsernameFieldValid(): boolean {
    if (debouncedUsername === "") {
      setUsernameFieldError("Please input your username")
      scrollIntoView(document.querySelector("#username"))
      return false
    }

    if (!isValidUsername(debouncedUsername)) {
      setUsernameFieldError("A combination of letters, numbers, -, _, .")
      scrollIntoView(document.querySelector("#username"))
      return false
    }

    return true
  }

  function isFormValid(): boolean {
    return isNameFieldValid() && isEmailFieldValid() && isUsernameFieldValid()
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setNameField({
      value,
      error: "" // We reset any eventual errors
    })
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    // Error reset done in `useEffect`
  }

  const handleEmailBlur = () => {
    isEmailFieldValid()
  }

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
    // Error reset done in `useEffect`
  }

  const handleUsernameBlur = () => {
    isUsernameFieldValid()
  }

  const handleFormSubmit = async () => {
    if (!isFormValid()) {
      return
    }

    setIsSubmittingForm(true)

    await updateUser(appContext, {
      ...loggedInUser!,
      name: nameField.value,
      email: debouncedEmail,
      username: debouncedUsername
    })

    setIsSubmittingForm(false)
    setHasSaved(true)
  }

  return (
    <div className="page settings my-account">
      <main className="container">
        <FadeIn>
          <h2>Account</h2>
        </FadeIn>

        <FadeIn>
          <FormControl error={nameField.error !== ""} id="name">
            <FormLabel>Name</FormLabel>
            <Input
              variant="soft"
              size="lg"
              value={nameField.value}
              onChange={handleNameChange}
            />
            {nameField.error !== "" && <FormHelperText>{nameField.error}</FormHelperText>}
          </FormControl>
        </FadeIn>

        <FadeIn>
          <FormControl error={emailFieldError !== ""} id="email">
            <FormLabel>E-mail</FormLabel>
            <Input
              variant="soft"
              size="lg"
              placeholder="chris@hello.net"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              endDecorator={isCheckingEmailAvailability && <CircularLoader/>}
            />
            {emailFieldError !== "" && <FormHelperText>{emailFieldError}</FormHelperText>}
          </FormControl>
        </FadeIn>

        <FadeIn>
          <FormControl error={usernameFieldError !== ""} id="username">
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

        <FadeIn className="wrapper-next-button">
          <button
            className={classNames("button filled", { loading: isSubmittingForm })}
            disabled={emailFieldError !== "" || usernameFieldError !== ""}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleFormSubmit}
          >
            {isSubmittingForm && <ButtonLoader/>}
            <span>Save changes</span>
          </button>
        </FadeIn>

        {hasSaved && (
          <BottomRightInfoSnackbar onClose={() => setHasSaved(false)}>
            <span>Changes saved</span>
          </BottomRightInfoSnackbar>
        )}
      </main>
    </div>
  )
}
