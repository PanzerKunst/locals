import Quill from "quill"

import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { Artist } from "../Models/Artist.ts"
import { MusicGenre } from "../Models/MusicGenre.ts"
import { EmptyPost, Post } from "../Models/Post.ts"
import { EmptyPostWithTags, PostWithTags } from "../Models/PostWithTags.ts"

export async function fetchPost(id: number): Promise<PostWithTags | undefined> {
  const result = await fetch(`${config.BACKEND_URL}/post/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while fetching post")
  }

  return result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as PostWithTags
}

export async function storePost(
  appContext: AppContextType,
  title: string,
  taggedArtists: Artist[],
  taggedGenres: MusicGenre[],
  quill: Quill
): Promise<EmptyPostWithTags> {
  const loggedInUser = appContext.loggedInUser

  if (!loggedInUser) {
    throw new Error("Cannot store post with no user in session")
  }

  const result = await fetch(`${config.BACKEND_URL}/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post: {
        userId: loggedInUser.id,
        title,
        content: quill.root.innerHTML
      },
      taggedArtists,
      taggedGenres
    })
  })

  if (!result.ok) {
    throw new Error(`Error while storing post for user ID ${loggedInUser.id}`)
  }

  return await result.json() as EmptyPostWithTags
}

export async function updatePost(
  emptyPost: EmptyPost,
  title: string,
  taggedArtists: Artist[],
  taggedGenres: MusicGenre[],
  quill: Quill
): Promise<EmptyPostWithTags> {
  const result = await fetch(`${config.BACKEND_URL}/post`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post: {
        ...emptyPost,
        title,
        content: quill.root.innerHTML
      },
      taggedArtists,
      taggedGenres
    })
  })

  if (!result.ok) {
    throw new Error(`Error while updating post ${JSON.stringify(emptyPost)}`)
  }

  return await result.json() as EmptyPostWithTags
}

export async function publishPost(post: Post): Promise<EmptyPostWithTags> {
  const result = await fetch(`${config.BACKEND_URL}/post/publish/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while publishing post ${JSON.stringify(post)}`)
  }

  return await result.json() as EmptyPostWithTags
}