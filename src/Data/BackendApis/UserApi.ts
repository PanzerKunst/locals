import { config } from "../../config.ts"
import { User } from "../BackendModels/User.ts"
import { SpotifyUserProfile } from "../SpotifyModels/SpotifyUserProfile.ts"

export async function storeUser(sporifyUserProfile: SpotifyUserProfile): Promise<User> {
  const url = `${config.BACKEND_URL}/user`

  const result = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sporifyUserProfile)
  })

  if (!result.ok) {
    throw new Error("Error while storing user")
  }

  return await result.json() as User
}
