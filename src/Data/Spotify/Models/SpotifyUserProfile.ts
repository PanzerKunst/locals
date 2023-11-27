import { SpotifyExternalUrls } from "./SpotifyExternalUrls.ts"
import { SpotifyFollowers } from "./SpotifyFollowers.ts"
import { SpotifyMedia } from "./SpotifyMedia.ts"

export type SpotifyUserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content?: {
    filter_enabled: boolean,
    filter_locked: boolean
  },
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  href: string;
  id: string;
  images: SpotifyMedia[];
  product: string;
  type: string;
  uri: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSpotifyUserProfileCompatible(obj: any): obj is SpotifyUserProfile {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  // Get all keys of the object
  /* const keys = Object.keys(obj)
  const allowedKeys = ["id"]

  // Check for no additional keys
  if (keys.some(key => !allowedKeys.includes(key))) {
    return false
  } */

  // Check for the existence and type of optional properties
  if (typeof obj.id !== "string") {
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}
