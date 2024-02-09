import { Artist, isArtistCompatible } from "./Artist.ts"
import { config } from "../../../config.ts"

export type ArtistWithFollowStatus = {
  artist: Artist;
  isFollowed: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
export function isArtistWithFollowStatusCompatible(obj: any): obj is ArtistWithFollowStatus {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  if (!config.IS_PROD) {
    // Get all keys of the object
    const keys = Object.keys(obj)
    const allowedKeys = ["artist", "isFollowed"]

    // Check for no additional keys
    if (keys.some(key => !allowedKeys.includes(key))) {
      return false
    }
  }

  // Check for the existence and type of optional properties
  if (!isArtistCompatible(obj.artist)) {
    console.log("ArtistWithFollowStatus incompatible: '!isArtistCompatible(obj.artist)'")
    return false
  }
  if (typeof obj.isFollowed !== "boolean") {
    console.log("ArtistWithFollowStatus incompatible: 'typeof obj.isFollowed !== \"boolean\"'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
