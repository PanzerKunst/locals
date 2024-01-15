import { config } from "../../../config.ts"
import { User } from "../Models/User.ts"

export async function storeUserFollowingAuthors(user: User, followedAuthors: User[]): Promise<User[]> {
  const result = await fetch(`${config.BACKEND_URL}/userFollowingAuthors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user,
      followedAuthors
    })
  })

  if (!result.ok) {
    throw new Error("Error while storing userFollowingAuthors")
  }

  return await result.json() as User[]
}
