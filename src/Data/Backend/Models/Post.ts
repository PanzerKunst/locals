// Taken by copy/pasting the last part of the bubble when hovering `posts.$inferInsert`
import { config } from "../../../config.ts"

export type NewPost = {
  userId: number;
  content: string;
  title?: string;
  heroImagePath?: string;
}

// Taken by copy/pasting the last part of the bubble when hovering `posts.$inferSelect`
export type Post = NewPost & {
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  slug?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
export function isPostCompatible(obj: any): boolean {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  if (!config.IS_PROD) {
    // Get all keys of the object
    const keys = Object.keys(obj)
    const allowedKeys = ["userId", "content", "title", "heroImagePath", "id", "createdAt", "updatedAt", "publishedAt", "slug"]

    // Check for no additional keys
    if (keys.some(key => !allowedKeys.includes(key))) {
      return false
    }
  }

  // Check for the existence and type of optional properties
  if (typeof obj.userId !== "number") {
    console.log("Post incompatible: 'typeof obj.userId !== \"number\"'")
    return false
  }
  if (typeof obj.content !== "string") {
    console.log("Post incompatible: 'typeof obj.content !== \"string\"'")
    return false
  }
  if (obj.title && typeof obj.title !== "string") {
    console.log("Post incompatible: 'obj.title && typeof obj.title !== \"string\"'")
    return false
  }
  if (obj.heroImagePath && typeof obj.heroImagePath !== "string") {
    console.log("Post incompatible: 'obj.heroImagePath && typeof obj.heroImagePath !== \"string\"'")
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
  if (obj.slug && typeof obj.slug !== "string") {
    console.log("obj.slug && typeof obj.slug !== \"string\"'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
