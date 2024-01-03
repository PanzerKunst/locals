import Quill from "quill"

import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { Artist } from "../Models/Artist.ts"
import { Post } from "../Models/Post.ts"
import { PostWithTags } from "../Models/PostWithTags.ts"
import { User } from "../Models/User.ts"

export async function fetchPostOfId(id: number): Promise<PostWithTags | undefined> {
  const result = await fetch(`${config.BACKEND_URL}/post/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching post of id ${id}`)
  }

  return result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as PostWithTags
}

export async function fetchPostOfUserAndSlug(username: string, slug: string): Promise<PostWithTags | undefined> {
  const result = await fetch(`${config.BACKEND_URL}/post/${username}/${slug}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching post of user ${username} and slug ${slug}`)
  }

  return result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as PostWithTags
}

export async function storePost(
  appContext: AppContextType,
  title: string,
  taggedArtists: Artist[],
  heroImagePath: string | undefined,
  quill: Quill
): Promise<PostWithTags> {
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
        content: quill.root.innerHTML,
        heroImagePath
      },
      taggedArtists
    })
  })

  if (!result.ok) {
    throw new Error(`Error while storing post for user ID ${loggedInUser.id}`)
  }

  return await result.json() as PostWithTags
}

export async function updatePost(
  post: Post,
  title: string,
  taggedArtists: Artist[],
  heroImagePath: string | undefined,
  quill: Quill
): Promise<PostWithTags> {
  const result = await fetch(`${config.BACKEND_URL}/post`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post: {
        ...post,
        title,
        content: quill.root.innerHTML,
        heroImagePath
      },
      taggedArtists
    })
  })

  if (!result.ok) {
    throw new Error(`Error while updating post ${JSON.stringify(post)}`)
  }

  return await result.json() as PostWithTags
}

export async function changePostPublicationStatus(post: Post, isPublish: boolean): Promise<PostWithTags> {
  const result = await fetch(`${config.BACKEND_URL}/post/${post.id}?publish=${isPublish}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while changing publication status for post ${JSON.stringify(post)}`)
  }

  return await result.json() as PostWithTags
}

export async function fetchPostsByUser(user: User): Promise<PostWithTags[]> {
  const result = await fetch(`${config.BACKEND_URL}/posts/user/${user.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching posts for userID ${user.id}`)
  }

  return await result.json() as PostWithTags[]
}

export async function deletePost(post: Post): Promise<void> {
  const result = await fetch(`${config.BACKEND_URL}/post`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post })
  })

  if (!result.ok) {
    throw new Error(`Error while delete post of ID ${post.id}`)
  }
}
