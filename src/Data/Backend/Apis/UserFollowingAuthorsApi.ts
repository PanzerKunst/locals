import { config } from "../../../config.ts"
import { User } from "../Models/User.ts"

export async function storeUserFollowingAuthor(user: User, followedAuthor: User): Promise<User[]> {
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

  return await result.json() as User[]
}
