// Taken by copy/pasting the last part of the bubble when hovering `artists.$inferInsert`
import { config } from "../../../config.ts"

export type NewArtist = {
  spotifyId: string,
  name: string
}

// Taken by copy/pasting the last part of the bubble when hovering `artists.$inferSelect`
export type Artist = NewArtist & {
  id: number,
  createdAt: string,
  updatedAt: string,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArtistCompatible(obj: any): obj is Artist {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  if (!config.IS_PROD) {
    // Get all keys of the object
    const keys = Object.keys(obj)
    const allowedKeys = ["spotifyId", "name", "id", "createdAt", "updatedAt"]

    // Check for no additional keys
    if (keys.some(key => !allowedKeys.includes(key))) {
      return false
    }
  }

  // Check for the existence and type of optional properties
  if (typeof obj.spotifyId !== "string") {
    console.log("Artist incompatible: 'typeof obj.spotifyId !== \"string\"'")
    return false
  }
  if (typeof obj.name !== "string") {
    console.log("Artist incompatible: 'typeof obj.name !== \"string\"'")
    return false
  }
  if (typeof obj.id !== "number") {
    console.log("Artist incompatible: 'obj.id !== \"number\"'")
    return false
  }
  if (typeof obj.createdAt !== "string") {
    console.log("Artist incompatible: 'typeof obj.createdAt !== \"string\"'")
    return false
  }
  if (typeof obj.updatedAt !== "string") {
    console.log("Artist incompatible: 'typeof obj.updatedAt !== \"string\"'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}
