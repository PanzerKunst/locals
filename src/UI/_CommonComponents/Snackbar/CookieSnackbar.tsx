import { Cookie } from "@mui/icons-material"
import { useState } from "react"
import { Link } from "react-router-dom"

import { AppSnackbar } from "./AppSnackbar.tsx"
import { getCookieConsentFromLocalStorage, saveCookieConsentInLocalStorage } from "../../../Util/LocalStorage.ts"


import "./CookieSnackbar.scss"

export function CookieSnackbar() {
  const [isOpen, setIsOpen] = useState(true)

  const cookieConsent = getCookieConsentFromLocalStorage()

  if (cookieConsent) {
    return undefined
  }

  const handleAllowAll = () => {
    setIsOpen(false)
    saveCookieConsentInLocalStorage("all")
  }

  const handleRejectNonEssential = () => {
    setIsOpen(false)
    saveCookieConsentInLocalStorage("necessary")
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
        <p>We use cookies for analytics.<br/>
          Learn more on our <Link to="/privacy" className="underlined disappears">privacy policy</Link>.</p>
        <div>
          <button className="fixed-height transparent-bordered" onClick={handleRejectNonEssential}>No, thanks</button>
          <button className="fixed-height filling" onClick={handleAllowAll}>It&apos;s okay</button>
        </div>
      </div>
    </AppSnackbar>
  )
}
