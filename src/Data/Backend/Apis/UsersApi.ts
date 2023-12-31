import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { GeoapifyFeature } from "../../Geoapify/Models/GeoapifyFeature.ts"
import { SpotifyUserProfile } from "../../Spotify/Models/SpotifyUserProfile.ts"
import { NewUser, User } from "../Models/User.ts"

export async function fetchUser(appContext: AppContextType, spotifyUserProfile: SpotifyUserProfile): Promise<User | undefined> {
  const result = await fetch(`${config.BACKEND_URL}/user/spotifyId/${spotifyUserProfile.id}`, {
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

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const result = await fetch(`${config.BACKEND_URL}/user/username/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while checking username availability")
  }

  return result.status === httpStatusCode.NO_CONTENT
}

export async function storeUser(
  appContext: AppContextType,
  spotifyUserProfile: SpotifyUserProfile,
  username: string,
  geoapifyFeature: GeoapifyFeature
): Promise<User> {
  const newUser: NewUser = {
    spotifyId: spotifyUserProfile.id,
    name: spotifyUserProfile.display_name,
    username,
    email: spotifyUserProfile.email
  }

  // TODO: remove
  console.log("storeUser > geoapifyFeature", geoapifyFeature)

  const result = await fetch(`${config.BACKEND_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: newUser,
      geoapifyFeature
    })
  })

  if (!result.ok) {
    throw new Error(`Error while storing user ${JSON.stringify(newUser)}`)
  }

  const user = await result.json() as User

  appContext.setLoggedInUser(user)

  return user
}

export async function updateUser(appContext: AppContextType, user: User): Promise<User> {
  const result = await fetch(`${config.BACKEND_URL}/user`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user })
  })

  if (!result.ok) {
    throw new Error(`Error while updating user ${JSON.stringify(user)}`)
  }

  const updatedUser = await result.json() as User

  appContext.setLoggedInUser(updatedUser)

  return updatedUser
}

export async function deleteUser(user: User): Promise<void> {
  const result = await fetch(`${config.BACKEND_URL}/user`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user })
  })

  if (!result.ok) {
    throw new Error(`Error while deleting user ${JSON.stringify(user)}`)
  }
}
