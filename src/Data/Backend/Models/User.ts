import { config } from "../../../config.ts"

// Taken by copy/pasting the last part of the bubble when hovering `users.$inferInsert`
export type NewUser = {
  name: string,
  spotifyId: string,
  username: string,
  email: string,
  avatarUrl?: string,
  isDeleted?: boolean,
}

// Taken by copy/pasting the last part of the bubble when hovering `users.$inferSelect`
export type User = NewUser & {
  id: number,
  createdAt: string,
  updatedAt: string,
  lastSeenAt: string,
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
export function isUserCompatible(obj: any): obj is User {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  if (!config.IS_PROD) {
    // Get all keys of the object
    const keys = Object.keys(obj)
    const allowedKeys = ["name", "spotifyId", "username", "email", "avatarUrl", "isDeleted", "id", "createdAt", "updatedAt", "lastSeenAt"]

    // Check for no additional keys
    if (keys.some(key => !allowedKeys.includes(key))) {
      return false
    }
  }

  // Check for the existence and type of optional properties
  if (typeof obj.name !== "string") {
    console.log("User incompatible: 'typeof obj.name !== \"string\"'")
    return false
  }
  if (typeof obj.spotifyId !== "string") {
    console.log("User incompatible: 'typeof obj.spotifyId !== \"string\"'")
    return false
  }
  if (typeof obj.username !== "string") {
    console.log("User incompatible: 'typeof obj.username !== \"string\"'")
    return false
  }
  if (typeof obj.email !== "string") {
    console.log("User incompatible: 'typeof obj.email !== \"string\"'")
    return false
  }
  if (obj.avatarUrl && typeof obj.avatarUrl !== "string") {
    console.log("User incompatible: 'obj.avatarUrl && typeof obj.avatarUrl !== \"string\"'")
    return false
  }
  if (obj.isDeleted && typeof obj.isDeleted !== "boolean") {
    console.log("User incompatible: 'obj.isDeleted && typeof obj.isDeleted !== \"boolean\"'")
    return false
  }
  if (typeof obj.id !== "number") {
    console.log("User incompatible: 'obj.id !== \"number\"'")
    return false
  }
  if (typeof obj.createdAt !== "string") {
    console.log("User incompatible: 'typeof obj.createdAt !== \"string\"'")
    return false
  }
  if (typeof obj.updatedAt !== "string") {
    console.log("User incompatible: 'typeof obj.updatedAt !== \"string\"'")
    return false
  }
  if (typeof obj.lastSeenAt !== "string") {
    console.log("User incompatible: 'typeof obj.lastSeenAt !== \"string\"'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
