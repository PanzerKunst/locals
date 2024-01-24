import classNames from "classnames"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { FollowedArtists } from "./FollowedArtists.tsx"
import { FollowedAuthors } from "./FollowedAuthors.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { Artist } from "../../../Data/Backend/Models/Artist.ts"
import { User } from "../../../Data/Backend/Models/User.ts"
import { AppUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"
import { useViewportSize } from "../../../Util/BrowserUtils.ts"
import { useHeaderTitle } from "../../_CommonComponents/AppHeader/AppHeader.ts"
import { BottomRightInfoSnackbar } from "../../_CommonComponents/Snackbar/BottomRightInfoSnackbar.tsx"
import { SettingsSidebar } from "../SettingsSidebar.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./SubscriptionsPage.scss"

export function SubscriptionsPage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const currentUser = appContext.loggedInUser

  const loggedInUser = currentUser?.user
  const { isSidebarHidden } = appContext

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")
  const isSidebarHideable = viewportWidth < viewportWidthMd

  const [hasSaved, setHasSaved] = useState(false)


  // Followed artists

  // TODO const [artistFilter, setArtistFilter] = useState("")
  const artists = currentUser?.followedArtists || []
  const [followedArtists, setFollowedArtists] = useState(artists)


  // Followed authors

  // TODO const [authorFilter, setAuthorFilter] = useState("")
  const authors = currentUser?.followedAuthors || []
  const [followedAuthors, setFollowedAuthors] = useState(authors)

  useHeaderTitle(isSidebarHideable && !isSidebarHidden ? "Settings" : "Subscriptions")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const handleToggleFollowingArtist = (artist: Artist) => {
    const isAlreadyInList = followedArtists.some(followedArtist => followedArtist.id === artist.id)

    const updatedArtists = isAlreadyInList
      ? followedArtists.filter(followedArtist => followedArtist.id !== artist.id)
      : [...followedArtists, artist]

    setFollowedArtists(updatedArtists)
  }

  const handleToggleFollowingAuthor = (author: User) => {
    const isAlreadyInList = followedAuthors.some(followedAuthor => followedAuthor.id === author.id)

    const updatedAuthors = isAlreadyInList
      ? followedAuthors.filter(followedAuthor => followedAuthor.id !== author.id)
      : [...followedAuthors, author]

    setFollowedAuthors(updatedAuthors)
  }

  const handleSaveFollowedArtistsClick = () => {
    // TODO
  }

  const handleSaveFollowedAuthorsClick = () => {
    // TODO
  }

  return (
    <div className={classNames("page settings with-sidebar subscriptions", { "sidebar-hidden": isSidebarHideable && isSidebarHidden })}>
      <SettingsSidebar isHideable={isSidebarHideable}/>
      <main className="container">
        <section>
          <h2>Subscribed Artists</h2>

          <FollowedArtists artists={artists} followed={followedArtists} onToggle={handleToggleFollowingArtist}/>

          <div className="button-wrapper">
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button className="button filled" onClick={handleSaveFollowedArtistsClick}>
              <span>Save changes</span>
            </button>
          </div>
        </section>

        <section>
          <h2>Subscribed Authors</h2>

          <FollowedAuthors authors={authors} followed={followedAuthors} onToggle={handleToggleFollowingAuthor}/>

          <div className="button-wrapper">
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button className="button filled" onClick={handleSaveFollowedAuthorsClick}>
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
