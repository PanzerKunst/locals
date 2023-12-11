import { Artist, isArtistCompatible } from "./Artist.ts"
import { isGenreCompatible, MusicGenre } from "./MusicGenre.ts"
import { EmptyPost, isPostCompatible, Post } from "./Post.ts"
import { config } from "../../../config.ts"

export type EmptyPostWithTags = {
  post: EmptyPost;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
}

/* TODO export type NewPostWithTags = {
  post: NewPost;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
} */

export type PostWithTags = {
  post: Post;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
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
    const allowedKeys = ["post", "taggedArtists", "taggedGenres"]

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
  if (!Array.isArray(obj.taggedArtists) || obj.taggedArtists.some((item: any) => !isArtistCompatible(item))) {
    console.log("PostWithTags incompatible: '!Array.isArray(obj.taggedArtists) || obj.taggedArtists.some((item: any) => !isArtistCompatible(item))'")
    return false
  }
  if (!Array.isArray(obj.taggedGenres) || obj.taggedGenres.some((item: any) => !isGenreCompatible(item))) {
    console.log("PostWithTags incompatible: '!Array.isArray(obj.taggedGenres) || obj.taggedGenres.some((item: any) => !isGenreCompatible(item))'")
    return false
  }

  // If all checks pass, then the object matches the type
  return true
}

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
