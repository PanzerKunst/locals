import { Cookie } from "@mui/icons-material"
import { useState } from "react"

import { AppSnackbar } from "./AppSnackbar.tsx"
import { getCookieConsentFromLocalStorage, saveCookieConsentInLocalStorage } from "../../../Util/LocalStorage.ts"

import "./CookieSnackbar.scss"

export function CookieSnackbar() {
  const [isOpen, setIsOpen] = useState(true)

  const cookieConsent = getCookieConsentFromLocalStorage()

  if (cookieConsent) {
    return undefined
  }

  const handleRejectStats = () => {
    setIsOpen(false)
    saveCookieConsentInLocalStorage("necessary")
  }

  const handleAcceptStats = () => {
    setIsOpen(false)
    saveCookieConsentInLocalStorage("all")
  }

  return (
    <AppSnackbar
      color="neutral"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isOpen}
      className="cookie"
    >
      <Cookie/>
      <div>
        <span>About cookies...</span>
        <div>
          <button className="underlined disappears" onClick={handleRejectStats}>Only necessary</button>
          <button className="underlined disappears" onClick={handleAcceptStats}>Accept analytics</button>
        </div>
      </div>
    </AppSnackbar>
  )
}
