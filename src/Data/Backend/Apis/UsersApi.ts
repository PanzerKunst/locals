import _last from "lodash/last"
import qs from "qs"

import { fetchArtistOfTagName } from "./ArtistsApi.ts"
import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { GeoapifyFeature } from "../../Geoapify/Models/GeoapifyFeature.ts"
import { SpotifyUserProfile } from "../../Spotify/Models/SpotifyUserProfile.ts"
import { NewUser, User } from "../Models/User.ts"
import { UserWithFollowedArtistsAndAuthors } from "../Models/UserWithMore.ts"

export async function fetchUser(
  appContext: AppContextType,
  spotifyUserProfile: SpotifyUserProfile
): Promise<UserWithFollowedArtistsAndAuthors | undefined> {
  const queryParams = { spotifyId: spotifyUserProfile.id }

  const result = await fetch(`${config.BACKEND_URL}/user?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while fetching user")
  }

  const userWithFollowedArtistsAndAuthors = result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as UserWithFollowedArtistsAndAuthors

  appContext.setLoggedInUser(userWithFollowedArtistsAndAuthors)

  return userWithFollowedArtistsAndAuthors
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const artistWithThatTagName = await fetchArtistOfTagName(username)

  if (artistWithThatTagName) {
    return false
  }

  const queryParams = { username }

  const result = await fetch(`${config.BACKEND_URL}/user?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while checking username availability")
  }

  return result.status === httpStatusCode.NO_CONTENT
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const queryParams = { email }

  const result = await fetch(`${config.BACKEND_URL}/user?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while checking email availability")
  }

  return result.status === httpStatusCode.NO_CONTENT
}

export async function storeUser(
  appContext: AppContextType,
  spotifyUserProfile: SpotifyUserProfile,
  username: string,
  geoapifyFeature: GeoapifyFeature
): Promise<UserWithFollowedArtistsAndAuthors> {
  const newUser: NewUser = {
    spotifyId: spotifyUserProfile.id,
    name: spotifyUserProfile.display_name,
    username,
    email: spotifyUserProfile.email,
    avatarUrl: _last(spotifyUserProfile.images)?.url
  }

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

  const userWithFollowedArtistsAndAuthors = await result.json() as UserWithFollowedArtistsAndAuthors

  appContext.setLoggedInUser(userWithFollowedArtistsAndAuthors)

  return userWithFollowedArtistsAndAuthors
}

export async function updateUser(appContext: AppContextType, user: User): Promise<UserWithFollowedArtistsAndAuthors> {
  const result = await fetch(`${config.BACKEND_URL}/user`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user })
  })

  if (!result.ok) {
    throw new Error(`Error while updating user ${JSON.stringify(user)}`)
  }

  const updatedUserWithFollowedArtistsAndAuthors = await result.json() as UserWithFollowedArtistsAndAuthors

  appContext.setLoggedInUser(updatedUserWithFollowedArtistsAndAuthors)

  return updatedUserWithFollowedArtistsAndAuthors
}

export async function deleteUser(user: User, shouldAlsoDeletePosts: boolean): Promise<void> {
  const queryParams = { deletePosts: shouldAlsoDeletePosts }

  const result = await fetch(`${config.BACKEND_URL}/user?${qs.stringify(queryParams)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user })
  })

  if (!result.ok) {
    throw new Error(`Error while deleting user ${JSON.stringify(user)}`)
  }
}
