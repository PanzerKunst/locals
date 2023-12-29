import Quill from "quill"

import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { Artist } from "../Models/Artist.ts"
import { MusicGenre } from "../Models/MusicGenre.ts"
import { EmptyPost, Post } from "../Models/Post.ts"
import { EmptyPostWithTags, PostWithAuthorAndTags } from "../Models/PostWithTags.ts"
import { User } from "../Models/User.ts"

export async function fetchPostOfId(id: number): Promise<PostWithAuthorAndTags | undefined> {
  const result = await fetch(`${config.BACKEND_URL}/post/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching post of id ${id}`)
  }

  return result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as PostWithAuthorAndTags
}

export async function fetchPostOfUserAndSlug(username: string, slug: string): Promise<PostWithAuthorAndTags | undefined> {
  const result = await fetch(`${config.BACKEND_URL}/post/${username}/${slug}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching post of user ${username} and slug ${slug}`)
  }

  return result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as PostWithAuthorAndTags
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

export async function changePostPublicationStatus(post: Post, isPublish: boolean): Promise<EmptyPostWithTags> {
  const result = await fetch(`${config.BACKEND_URL}/post/${post.id}?publish=${isPublish}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while changing publication status for post ${JSON.stringify(post)}`)
  }

  return await result.json() as EmptyPostWithTags
}

export async function fetchPostsByUser(user: User): Promise<PostWithAuthorAndTags[]> {
  const result = await fetch(`${config.BACKEND_URL}/posts/user/${user.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching posts for userID ${user.id}`)
  }

  return await result.json() as PostWithAuthorAndTags[]
}

export async function deletePost(post: Post): Promise<void> {
  const { content, ...emptyPost } = post // eslint-disable-line no-unused-vars

  const result = await fetch(`${config.BACKEND_URL}/post`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emptyPost })
  })

  if (!result.ok) {
    throw new Error(`Error while delete post of ID ${post.id}`)
  }
}
