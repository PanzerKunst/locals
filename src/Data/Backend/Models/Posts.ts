// Taken by copy/pasting the last part of the bubble when hovering `posts.$inferInsert`
export type NewPost = {
  userId: number,
  content: string,
}

// Taken by copy/pasting the last part of the bubble when hovering `posts.$inferSelect`
export type Post = NewPost & {
  id: number,
  createdAt: string,
  updatedAt: string,
  publishedAt?: string,
}

export type EmptyPost = Omit<Post, "content">

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPostCompatible(obj: any, isEmpty: boolean | undefined = false): boolean {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  // Get all keys of the object
  const keys = Object.keys(obj)
  const allowedKeys = ["userId", "content", "id", "createdAt", "updatedAt", "publishedAt"]

  // Check for no additional keys
  if (keys.some(key => !allowedKeys.includes(key))) {
    return false
  }

  // Check for the existence and type of optional properties
  if (typeof obj.userId !== "number") {
    console.log("Post incompatible: 'typeof obj.userId !== \"number\"'")
    return false
  }
  if (!isEmpty && typeof obj.content !== "string") {
    console.log("Post incompatible: '!isEmpty && typeof obj.content !== \"string\"'")
    return false
  }
  if (typeof obj.id !== "number") {
    console.log("Post incompatible: 'obj.id !== \"number\"'")
    return false
  }
  if (typeof obj.createdAt !== "string") {
    console.log("Post incompatible: 'typeof obj.createdAt !== \"string\"'")
    return false
  }
  if (typeof obj.updatedAt !== "string") {
    console.log("Post incompatible: 'typeof obj.updatedAt !== \"string\"'")
    return false
  }
  if (obj.publishedAt && typeof obj.publishedAt !== "string") {
    console.log("Post incompatible: 'obj.publishedAt && typeof obj.publishedAt !== \"string\"'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}
