import classNames from "classnames"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { FollowedArtists } from "./FollowedArtists.tsx"
import { FollowedAuthors } from "./FollowedAuthors.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { updateFollowedArtists } from "../../../Data/Backend/Apis/UserFavouriteArtistsApi.ts"
import { updateFollowedAuthors } from "../../../Data/Backend/Apis/UserFollowingAuthorsApi.ts"
import { Artist } from "../../../Data/Backend/Models/Artist.ts"
import { User } from "../../../Data/Backend/Models/User.ts"
import { AppUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"
import { useViewportSize } from "../../../Util/BrowserUtils.ts"
import { useHeaderTitle } from "../../_CommonComponents/AppHeader/AppHeader.ts"
import { SettingsSidebar } from "../SettingsSidebar.tsx"
import { ButtonLoader } from "../../_CommonComponents/ButtonLoader.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./SubscriptionsPage.scss"

export function SubscriptionsPage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const currentUser = appContext.loggedInUser
  const loggedInUser = currentUser?.user
  const { isSidebarHidden, setLoggedInUser } = appContext

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")
  const isSidebarHideable = viewportWidth < viewportWidthMd

  // Followed artists
  const artists = currentUser?.followedArtists || []
  const [followedArtists, setFollowedArtists] = useState(artists)
  const [isSavingFollowedArtists, setIsSavingFollowedArtists] = useState(false)

  // Followed authors
  const authors = currentUser?.followedAuthors || []
  const [followedAuthors, setFollowedAuthors] = useState(authors)
  const [isSavingFollowedAuthors, setIsSavingFollowedAuthors] = useState(false)

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

  const handleSaveFollowedArtistsClick = async () => {
    setIsSavingFollowedArtists(true)

    await updateFollowedArtists(loggedInUser!, followedArtists)
    setLoggedInUser({ ...currentUser!, followedArtists })

    setIsSavingFollowedArtists(false)
  }

  const handleSaveFollowedAuthorsClick = async () => {
    setIsSavingFollowedAuthors(true)

    await updateFollowedAuthors(loggedInUser!, followedAuthors)
    setLoggedInUser({ ...currentUser!, followedAuthors })

    setIsSavingFollowedAuthors(false)
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
            <button className="button filled" onClick={handleSaveFollowedArtistsClick} disabled={isSavingFollowedArtists}>
              {isSavingFollowedArtists && <ButtonLoader/>}
              <span>Save changes</span>
            </button>
          </div>
        </section>

        <section>
          <h2>Subscribed Authors</h2>

          {authors.length > 0 ? (
            <FollowedAuthors authors={authors} followed={followedAuthors} onToggle={handleToggleFollowingAuthor}/>
          ) : (
            <p>Not subscribed to any author.</p>
          )}

          <div className="button-wrapper">
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button className="button filled" onClick={handleSaveFollowedAuthorsClick} disabled={isSavingFollowedAuthors || authors.length === 0}>
              {isSavingFollowedAuthors && <ButtonLoader/>}
              <span>Save changes</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
