import { ArtistWithFollowStatus, isArtistWithFollowStatusCompatible } from "./ArtistWithMore.ts"
import { isUserCompatible, User } from "./User.ts"
import { config } from "../../../config.ts"

export type UserWithFavouriteArtistsAndAuthors = {
  user: User;
  favouriteArtists: ArtistWithFollowStatus[];
  followedAuthors: User[];
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
export function isUserWithFavouriteArtistsAndAuthorsCompatible(obj: any): obj is UserWithFavouriteArtistsAndAuthors {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  if (!config.IS_PROD) {
    // Get all keys of the object
    const keys = Object.keys(obj)
    const allowedKeys = ["user", "favouriteArtists", "followedAuthors"]

    // Check for no additional keys
    if (keys.some(key => !allowedKeys.includes(key))) {
      return false
    }
  }

  // Check for the existence and type of optional properties
  if (!isUserCompatible(obj.user)) {
    console.log("UserWithFollowedArtistsAndAuthors incompatible: '!isUserCompatible(obj.user)'")
    return false
  }
  if (!Array.isArray(obj.favouriteArtists) || obj.favouriteArtists.some((item: any) => !isArtistWithFollowStatusCompatible(item))) {
    // eslint-disable-next-line max-len
    console.log("UserWithFollowedArtistsAndAuthors incompatible: '!Array.isArray(obj.favouriteArtists) || obj.favouriteArtists.some((item: any) => !isArtistWithFollowStatusCompatible(item))'")
    return false
  }
  if (!Array.isArray(obj.followedAuthors) || obj.followedAuthors.some((item: any) => !isUserCompatible(item))) {
    // eslint-disable-next-line max-len
    console.log("UserWithFollowedArtistsAndAuthors incompatible: '!Array.isArray(obj.followedAuthors) || obj.followedAuthors.some((item: any) => !isUserCompatible(item))'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
