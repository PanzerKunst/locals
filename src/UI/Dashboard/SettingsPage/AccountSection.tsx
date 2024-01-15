import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy"
import classNames from "classnames"
import { ChangeEvent, useEffect, useState } from "react"

import { useAppContext } from "../../../AppContext.tsx"
import { checkUsernameAvailability, updateUser } from "../../../Data/Backend/Apis/UsersApi.ts"
import { scrollIntoView } from "../../../Util/BrowserUtils.ts"
import { useDebounce } from "../../../Util/ReactUtils.ts"
import { Field, isValidEmail, isValidUsername } from "../../../Util/ValidationUtils.ts"
import { ButtonLoader } from "../../_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "../../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../../_CommonComponents/FadeIn.tsx"
import { BottomRightInfoSnackbar } from "../../_CommonComponents/Snackbar/BottomRightInfoSnackbar.tsx"

export function AccountSection() {
  const appContext = useAppContext()
  const loggedInUser = appContext.loggedInUser!.user

  const [nameField, setNameField] = useState<Field>({ value: loggedInUser.name || "", error: "" })
  const [emailField, setEmailField] = useState<Field>({ value: loggedInUser.email || "", error: "" })

  const [username, setUsername] = useState(loggedInUser.username || "")
  const debouncedUsername = useDebounce(username, 300)
  const [usernameFieldError, setUsernameFieldError] = useState("")
  const [isCheckingUsernameAvailability, setIsCheckingUsernameAvailability] = useState(false)

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const [hasSaved, setHasSaved] = useState(false)

  useEffect(() => {
    async function performUsernameAvailabilityCheck() {
      setIsCheckingUsernameAvailability(true)
      const isAvailable = await checkUsernameAvailability(debouncedUsername)
      setIsCheckingUsernameAvailability(false)
      setUsernameFieldError(isAvailable ? "" : "Username is not available")
    }

    setUsernameFieldError("")

    if (!isUsernameInputValid() || debouncedUsername === loggedInUser.username) {
      setIsCheckingUsernameAvailability(false)
      return
    }

    void performUsernameAvailabilityCheck()
  }, [debouncedUsername]) // eslint-disable-line react-hooks/exhaustive-deps

  function isNameInputValid(): boolean {
    const name = nameField.value

    if (name === "") {
      setNameField({ value: name, error: "Please input your name" })
      scrollIntoView(document.querySelector("#name"))
      return false
    }

    return true
  }

  function isEmailInputValid(): boolean {
    const email = emailField.value

    if (email === "") {
      setEmailField({ value: email, error: "Please input your email" })
      scrollIntoView(document.querySelector("#email"))
      return false
    }

    if (!isValidEmail(email)) {
      setEmailField({ value: email, error: "Invalid email, sorry" })
      scrollIntoView(document.querySelector("#email"))
      return false
    }

    return true
  }

  function isUsernameInputValid(): boolean {
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
    return isNameInputValid() && isEmailInputValid() && isUsernameInputValid()
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setNameField({
      value,
      error: "" // We reset any eventual errors
    })
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

  const handleFormSubmit = async () => {
    if (!isFormValid()) {
      return
    }

    setIsSubmittingForm(true)

    await updateUser(appContext, {
      ...loggedInUser,
      name: nameField.value,
      email: emailField.value,
      username: debouncedUsername
    })

    setIsSubmittingForm(false)
    setHasSaved(true)
  }

  return (
    <section>
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
        <FormControl error={emailField.error !== ""} id="email">
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
          disabled={emailField.error !== "" || usernameFieldError !== ""}
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
    </section>
  )
}
