import { AppContextType } from "../../../AppContext.tsx"
import { config } from "../../../config.ts"
import { User } from "../Models/User.ts"
import { UserWithFavouriteArtistsAndAuthors } from "../Models/UserWithMore.ts"

export async function storeUserFollowingAuthor(
  appContext: AppContextType,
  user: User,
  followedAuthor: User
): Promise<UserWithFavouriteArtistsAndAuthors> {
  const result = await fetch(`${config.BACKEND_URL}/followingAuthor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user,
      followedAuthor
    })
  })

  if (!result.ok) {
    throw new Error("Error while storing userFollowingAuthors")
  }

  const userWithFavouriteArtistsAndAuthors = await result.json() as UserWithFavouriteArtistsAndAuthors

  appContext.setLoggedInUser(userWithFavouriteArtistsAndAuthors)

  return userWithFavouriteArtistsAndAuthors
}

export async function removeFollowedAuthors(user: User, authorsToRemove: User[]) {
  const result = await fetch(`${config.BACKEND_URL}/followedAuthors`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user,
      authorsToRemove
    })
  })

  if (!result.ok) {
    throw new Error("Error while removing followed authors")
  }
}
