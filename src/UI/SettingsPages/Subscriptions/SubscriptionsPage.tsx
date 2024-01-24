import classNames from "classnames"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { SettingsSidebar } from "../SettingsSidebar.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { AppUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"
import { useViewportSize } from "../../../Util/BrowserUtils.ts"
import { useHeaderTitle } from "../../_CommonComponents/AppHeader/AppHeader.ts"
import { BottomRightInfoSnackbar } from "../../_CommonComponents/Snackbar/BottomRightInfoSnackbar.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

export function SubscriptionsPage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const currentUser = appContext.loggedInUser
  // TODO const followedArtists = currentUser?.followedArtists || []
  // TODO const followedAuthors = currentUser?.followedAuthors || []
  const loggedInUser = currentUser?.user
  const { isSidebarHidden } = appContext

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")
  const isSidebarHideable = viewportWidth < viewportWidthMd

  const [hasSaved, setHasSaved] = useState(false)


  // Followed artists

  /* TODO const [artistFilter, setArtistFilter] = useState("")
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(followedArtists) */


  // Followed authors

  /* TODO const [authorFilter, setAuthorFilter] = useState("")
  const [filteredAuthors, setFilteredAuthors] = useState<User[]>([]) */

  useHeaderTitle(isSidebarHideable && !isSidebarHidden ? "Settings" : "Subscriptions")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const handleSaveFollowedArtistsClick = () => {
    // TODO
  }

  return (
    <div className={classNames("page settings with-sidebar subscriptions", { "sidebar-hidden": isSidebarHideable && isSidebarHidden })}>
      <SettingsSidebar isHideable={isSidebarHideable}/>
      <main className="container">
        <section>
          <div className="button-wrapper">
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button className="button filled" onClick={handleSaveFollowedArtistsClick}>
              <span>Save changes</span>
            </button>
          </div>
        </section>

        {hasSaved && (
          <BottomRightInfoSnackbar onClose={() => setHasSaved(false)}>
            <span>Changes saved</span>
          </BottomRightInfoSnackbar>
        )}
      </main>
    </div>
  )
}
