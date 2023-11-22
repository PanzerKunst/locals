export type NewUser = {
  name: string,
  spotifyId: string,
  email: string
}

export type User = NewUser & {
  id: number
  createdAt: string
  updatedAt?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUserCompatible(obj: any): obj is User {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  // Get all keys of the object
  const keys = Object.keys(obj)
  const allowedKeys = ["name", "spotifyId", "email", "id", "createdAt", "updatedAt"]

  // Check for no additional keys
  if (keys.some(key => !allowedKeys.includes(key))) {
    return false
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
  if (typeof obj.email !== "string") {
    console.log("User incompatible: 'typeof obj.email !== \"string\"'")
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
  if (obj.updatedAt && typeof obj.updatedAt !== "string") {
    console.log("User incompatible: 'obj.updatedAt && typeof obj.updatedAt !== \"string\"'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}
