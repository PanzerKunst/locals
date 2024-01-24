import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Checkbox, FormControl, FormHelperText, FormLabel, Input, Modal, ModalDialog } from "@mui/joy"
import classNames from "classnames"
import { AnimatePresence, motion } from "framer-motion"
import { ChangeEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { SettingsSidebar } from "./SettingsSidebar.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { checkEmailAvailability, checkUsernameAvailability, deleteUser, updateUser } from "../../Data/Backend/Apis/UsersApi.ts"
import { ActionsFromAppUrl, AppUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { scrollIntoView, useViewportSize } from "../../Util/BrowserUtils.ts"
import { useDebounce } from "../../Util/ReactUtils.ts"
import { Field, isValidEmail, isValidUsername } from "../../Util/ValidationUtils.ts"
import { useHeaderTitle } from "../_CommonComponents/AppHeader/AppHeader.ts"
import { ButtonLoader } from "../_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { BottomRightInfoSnackbar } from "../_CommonComponents/Snackbar/BottomRightInfoSnackbar.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./AccountPage.scss"

const modalMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export function AccountPage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const loggedInUser = appContext.loggedInUser?.user
  const { isSidebarHidden } = appContext

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")
  const isSidebarHideable = viewportWidth < viewportWidthMd


  // Name, username, email

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


  // Danger zone

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [shouldAlsoDeletePosts, setShouldAlsoDeletePosts] = useState(false)

  useHeaderTitle(isSidebarHideable && !isSidebarHidden ? "Settings" : "Account")

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

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShouldAlsoDeletePosts(event.target.checked)
  }

  const handleConfirmDeleteClick = async () => {
    await deleteUser(loggedInUser!, shouldAlsoDeletePosts)
    setIsDeleteDialogOpen(false)
    navigate(`/?${AppUrlQueryParam.ACTION}=${ActionsFromAppUrl.SIGN_OUT}`)
  }

  return (
    <div className={classNames("page settings with-sidebar account", { "sidebar-hidden": isSidebarHideable && isSidebarHidden })}>
      <SettingsSidebar isHideable={isSidebarHideable}/>
      <main className="container">
        <section className="bordered">
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

          <div className="button-wrapper">
            <button
              className={classNames("button filled", { loading: isSubmittingForm })}
              disabled={isSubmittingForm || emailFieldError !== "" || usernameFieldError !== ""}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleFormSubmit}
            >
              {isSubmittingForm && <ButtonLoader/>}
              <span>Save changes</span>
            </button>
          </div>
        </section>

        <section className="bordered danger">
          <h2>Danger Zone</h2>

          <div className="button-wrapper">
            <button className="button filled danger" onClick={() => setIsDeleteDialogOpen(true)}>
              <span>Delete account</span>
            </button>
          </div>
        </section>

        <AnimatePresence>
          {isDeleteDialogOpen && (
            <Modal open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
              <motion.div
                initial={modalMotionVariants.initial}
                animate={modalMotionVariants.animate}
                exit={modalMotionVariants.initial}
                transition={{ duration: Number(s.animationDurationXs) }}
              >
                <ModalDialog>
                  <button className="button icon-only close" aria-label="close" onClick={() => setIsDeleteDialogOpen(false)}>
                    <FontAwesomeIcon icon={faXmark}/>
                  </button>
                  <div>
                    <span>Are you sure? Deletion is final.</span>
                    <FormControl id="delete-posts">
                      <Checkbox
                        label="Also delete all my posts"
                        variant="soft"
                        color="primary"
                        checked={shouldAlsoDeletePosts}
                        onChange={handleCheckboxChange}
                      />
                    </FormControl>
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <button className="button filled fixed-height danger" onClick={handleConfirmDeleteClick}>
                      <span>Delete my account</span>
                    </button>
                  </div>
                </ModalDialog>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>

        {hasSaved && (
          <BottomRightInfoSnackbar onClose={() => setHasSaved(false)}>
            <span>Changes saved</span>
          </BottomRightInfoSnackbar>
        )}
      </main>
    </div>
  )
}
