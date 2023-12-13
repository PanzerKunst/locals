import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { AccountSection } from "./AccountSection.tsx"
import { DangerZoneSection } from "./DangerZoneSection.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { appUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"
import { FadeIn } from "../../_CommonComponents/FadeIn.tsx"


import "./SettingsPage.scss"

export function SettingsPage() {
  const navigate = useNavigate()
  const { loggedInUser } = useAppContext()

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${appUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  return (
    <div className="page settings">
      <main className="container">
        <FadeIn>
          <h1>Settings</h1>
        </FadeIn>

        <AccountSection />
        <DangerZoneSection />
      </main>
    </div>
  )
}
