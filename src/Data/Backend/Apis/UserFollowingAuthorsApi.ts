import { AppContextType } from "../../../AppContext.tsx"
import { config } from "../../../config.ts"
import { User } from "../Models/User.ts"
import { UserWithFollowedArtistsAndAuthors } from "../Models/UserWithMore.ts"

export async function storeUserFollowingAuthor(
  appContext: AppContextType,
  user: User,
  followedAuthor: User
): Promise<UserWithFollowedArtistsAndAuthors> {
  const result = await fetch(`${config.BACKEND_URL}/userFollowingAuthor`, {
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

  const userWithFollowedArtistsAndAuthors = await result.json() as UserWithFollowedArtistsAndAuthors

  appContext.setLoggedInUser(userWithFollowedArtistsAndAuthors)

  return userWithFollowedArtistsAndAuthors
}
