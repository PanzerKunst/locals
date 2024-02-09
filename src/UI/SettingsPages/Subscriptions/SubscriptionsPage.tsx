import classNames from "classnames"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { FollowedArtists } from "./FollowedArtists.tsx"
import { FollowedAuthors } from "./FollowedAuthors.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { updateFavouriteArtists } from "../../../Data/Backend/Apis/UserFavouriteArtistsApi.ts"
import { removeFollowedAuthors } from "../../../Data/Backend/Apis/UserFollowingAuthorsApi.ts"
import { Artist } from "../../../Data/Backend/Models/Artist.ts"
import { ArtistWithFollowStatus } from "../../../Data/Backend/Models/ArtistWithMore.ts"
import { User } from "../../../Data/Backend/Models/User.ts"
import { AppUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"
import { useHeaderTitle } from "../../_CommonComponents/AppHeader/AppHeader.ts"
import { ButtonLoader } from "../../_CommonComponents/ButtonLoader.tsx"
import { useSidebarNav } from "../../_CommonComponents/SidebarNav.ts"
import { BottomRightInfoSnackbar } from "../../_CommonComponents/Snackbar/BottomRightInfoSnackbar.tsx"
import { SettingsSidebar } from "../SettingsSidebar.tsx"

import "./SubscriptionsPage.scss"

export function SubscriptionsPage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const currentUser = appContext.loggedInUser
  const loggedInUser = currentUser?.user
  const { setLoggedInUser } = appContext
  const { isSidebarHidden, isSidebarHideable } = useSidebarNav()

  const [hasSaved, setHasSaved] = useState(false)

  // Favourite artists
  const [favouriteArtists, setFavouriteArtists] = useState<ArtistWithFollowStatus[]>(currentUser?.favouriteArtists || [])
  const [isSavingFavouriteArtists, setIsSavingFavouriteArtists] = useState(false)

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
    const updatedFavouriteArtists = favouriteArtists.map(favouriteArtist => {
      if (favouriteArtist.artist.id !== artist.id) {
        return favouriteArtist
      }

      return {
        ...favouriteArtist,
        isFollowed: !favouriteArtist.isFollowed
      }
    })

    setFavouriteArtists(updatedFavouriteArtists)
  }

  const handleToggleFollowingAuthor = (author: User) => {
    const isAlreadyUnfollowed = unfollowedAuthors.some(unfollowedAuthor => unfollowedAuthor.id === author.id)

    const updatedUnfollowedAuthors = isAlreadyUnfollowed
      ? unfollowedAuthors.filter(unfollowedAuthor => unfollowedAuthor.id !== author.id)
      : [...unfollowedAuthors, author]

    setUnfollowedAuthors(updatedUnfollowedAuthors)
  }

  const handleSaveFavouriteArtistsClick = async () => {
    setIsSavingFavouriteArtists(true)

    await updateFavouriteArtists(loggedInUser!, favouriteArtists)

    setLoggedInUser({
      ...currentUser!,
      favouriteArtists
    })

    setIsSavingFavouriteArtists(false)
    setHasSaved(true)
  }

  const handleSaveFollowedAuthorsClick = async () => {
    setIsSavingFollowedAuthors(true)

    await removeFollowedAuthors(loggedInUser!, unfollowedAuthors)

    setLoggedInUser({
      ...currentUser!,
      followedAuthors: authors.filter(author => !unfollowedAuthors.some(unfollowedAuthor => unfollowedAuthor.id === author.id))
    })

    setIsSavingFollowedAuthors(false)
    setHasSaved(true)
  }

  return (
    <div className={classNames("page with-sidebar settings subscriptions", { "sidebar-hidden": isSidebarHideable && isSidebarHidden })}>
      <SettingsSidebar />
      <main className="container">
        <section>
          <h2>Subscribed Artists</h2>

          <FollowedArtists artistWithFollowStatus={favouriteArtists} onToggle={handleToggleFollowingArtist}/>

          <div className="button-wrapper">
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button className="button filled" onClick={handleSaveFavouriteArtistsClick} disabled={isSavingFavouriteArtists}>
              {isSavingFavouriteArtists && <ButtonLoader/>}
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

        {hasSaved && (
          <BottomRightInfoSnackbar onClose={() => setHasSaved(false)}>
            <span>Changes saved</span>
          </BottomRightInfoSnackbar>
        )}
      </main>
    </div>
  )
}
