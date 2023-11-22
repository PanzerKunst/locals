import qs from "qs"

import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { User } from "../Models/User.ts"
import { SpotifyUserProfile } from "../../Spotify/Models/SpotifyUserProfile.ts"

export async function fetchUser(appContext: AppContextType, spotifyUserProfile: SpotifyUserProfile): Promise<User | undefined> {
  const queryParams = { spotify_id: spotifyUserProfile.id }
  const queryString = `?${qs.stringify(queryParams)}`

  const result = await fetch(`${config.BACKEND_URL}/user${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while fetching user")
  }

  const user = result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as User

  appContext.setLoggedInUser(user)

  return user
}

export async function storeUser(appContext: AppContextType, spotifyUserProfile: SpotifyUserProfile): Promise<User> {
  const existingUser = await fetchUser(appContext, spotifyUserProfile)

  if (existingUser) {
    return existingUser
  }

  const result = await fetch(`${config.BACKEND_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spotifyUserProfile)
  })

  if (!result.ok) {
    throw new Error("Error while storing user")
  }

  const user = await result.json() as User

  appContext.setLoggedInUser(user)

  return user
}
