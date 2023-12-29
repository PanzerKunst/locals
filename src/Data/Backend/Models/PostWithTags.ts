import { Artist, isArtistCompatible } from "./Artist.ts"
import { EmptyPost, Post, isPostCompatible } from "./Post.ts"
import { User, isUserCompatible } from "./User.ts"
import { config } from "../../../config.ts"

export type EmptyPostWithTags = {
  post: EmptyPost;
  taggedArtists: Artist[];
}

/* TODO export type NewPostWithTags = {
  post: NewPost;
  taggedArtists: Artist[];
} */

export type PostWithAuthorAndTags = {
  post: Post;
  author: User;
  taggedArtists: Artist[];
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
export function isPostWithTagsCompatible(obj: any, isEmpty: boolean | undefined = false): boolean {
  // Check if the object is not null and is an object
  if (typeof obj !== "object" || !obj) {
    return false
  }

  if (!config.IS_PROD) {
    // Get all keys of the object
    const keys = Object.keys(obj)
    const allowedKeys = ["post", "taggedArtists"]

    // Check for no additional keys
    if (keys.some(key => !allowedKeys.includes(key))) {
      return false
    }
  }

  // Check for the existence and type of optional properties
  if (!isPostCompatible(obj.post, isEmpty)) {
    console.log("PostWithTags incompatible: '!isPostCompatible(obj.post, isEmpty)'")
    return false
  }
  if (obj.author && !isUserCompatible(obj.author)) {
    console.log("PostWithTags incompatible: 'obj.author && !isUserCompatible(obj.author)'")
    return false
  }
  if (!Array.isArray(obj.taggedArtists) || obj.taggedArtists.some((item: any) => !isArtistCompatible(item))) {
    console.log("PostWithTags incompatible: '!Array.isArray(obj.taggedArtists) || obj.taggedArtists.some((item: any) => !isArtistCompatible(item))'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
