import classNames from "classnames"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { FollowedArtists } from "./FollowedArtists.tsx"
import { FollowedAuthors } from "./FollowedAuthors.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { removeFavouriteArtists } from "../../../Data/Backend/Apis/UserFavouriteArtistsApi.ts"
import { removeFollowedAuthors } from "../../../Data/Backend/Apis/UserFollowingAuthorsApi.ts"
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
  const [unfollowedArtists, setUnfollowedArtists] = useState<Artist[]>([])
  const [isSavingFollowedArtists, setIsSavingFollowedArtists] = useState(false)

  // Followed authors
  const authors = currentUser?.followedAuthors || []
  const [unfollowedAuthors, setUnfollowedAuthors] = useState<User[]>([])
  const [isSavingFollowedAuthors, setIsSavingFollowedAuthors] = useState(false)

  useHeaderTitle(isSidebarHideable && !isSidebarHidden ? "Settings" : "Subscriptions")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const handleToggleFollowingArtist = (artist: Artist) => {
    const isAlreadyUnfollowed = unfollowedArtists.some(unfollowedArtist => unfollowedArtist.id === artist.id)

    const updatedUnfollowedArtists = isAlreadyUnfollowed
      ? unfollowedArtists.filter(unfollowedArtist => unfollowedArtist.id !== artist.id)
      : [...unfollowedArtists, artist]

    setUnfollowedArtists(updatedUnfollowedArtists)
  }

  const handleToggleFollowingAuthor = (author: User) => {
    const isAlreadyUnfollowed = unfollowedAuthors.some(unfollowedAuthor => unfollowedAuthor.id === author.id)

    const updatedUnfollowedAuthors = isAlreadyUnfollowed
      ? unfollowedAuthors.filter(unfollowedAuthor => unfollowedAuthor.id !== author.id)
      : [...unfollowedAuthors, author]

    setUnfollowedAuthors(updatedUnfollowedAuthors)
  }

  const handleSaveFollowedArtistsClick = async () => {
    setIsSavingFollowedArtists(true)

    await removeFavouriteArtists(loggedInUser!, unfollowedArtists)

    setLoggedInUser({
      ...currentUser!,
      followedArtists: artists.filter(artist => !unfollowedArtists.some(unfollowedArtist => unfollowedArtist.id === artist.id))
    })

    setIsSavingFollowedArtists(false)
  }

  const handleSaveFollowedAuthorsClick = async () => {
    setIsSavingFollowedAuthors(true)

    await removeFollowedAuthors(loggedInUser!, unfollowedAuthors)

    setLoggedInUser({
      ...currentUser!,
      followedAuthors: authors.filter(author => !unfollowedAuthors.some(unfollowedAuthor => unfollowedAuthor.id === author.id))
    })

    setIsSavingFollowedAuthors(false)
  }

  return (
    <div className={classNames("page with-sidebar settings subscriptions", { "sidebar-hidden": isSidebarHideable && isSidebarHidden })}>
      <SettingsSidebar isHideable={isSidebarHideable}/>
      <main className="container">
        <section>
          <h2>Subscribed Artists</h2>

          <FollowedArtists artists={artists} unfollowed={unfollowedArtists} onToggle={handleToggleFollowingArtist}/>

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
            <FollowedAuthors authors={authors} unfollowed={unfollowedAuthors} onToggle={handleToggleFollowingAuthor}/>
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
