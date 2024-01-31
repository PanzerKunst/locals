import _orderBy from "lodash/orderBy"
import qs from "qs"
import Quill from "quill"

import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { Artist } from "../Models/Artist.ts"
import { Post } from "../Models/Post.ts"
import { PostWithTags } from "../Models/PostWithMore.ts"

export async function storePost(
  appContext: AppContextType,
  title: string,
  taggedArtists: Artist[],
  heroImagePath: string | undefined,
  heroVideoUrl: string | undefined,
  quill: Quill
): Promise<PostWithTags> {
  const loggedInUser = appContext.loggedInUser?.user

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
        heroImagePath,
        heroVideoUrl
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
  heroVideoUrl: string | undefined,
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
        heroImagePath,
        heroVideoUrl
      },
      taggedArtists
    })
  })

  if (!result.ok) {
    throw new Error(`Error while updating post ${JSON.stringify(post)}`)
  }

  return await result.json() as PostWithTags
}

export async function changePostPublicationSettings(post: Post, isPublishing: boolean): Promise<PostWithTags> {
  const result = await fetch(`${config.BACKEND_URL}/post/publication?publish=${isPublishing}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post })
  })

  if (!result.ok) {
    throw new Error(`Error while changing publication settings for post ${JSON.stringify(post)}`)
  }

  return await result.json() as PostWithTags
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

export async function fetchPostsByUsername(username: string, fromDate: Date): Promise<PostWithTags[]> {
  const queryParams = { from: fromDate.toISOString() }

  const result = await fetch(`${config.BACKEND_URL}/posts/user/${username}?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching posts for username ${username}`)
  }

  return await result.json() as PostWithTags[]
}

export async function fetchPostsTaggingArtist(tagName: string, fromDate: Date): Promise<PostWithTags[]> {
  const queryParams = { from: fromDate.toISOString() }

  const result = await fetch(`${config.BACKEND_URL}/posts/artist/${tagName}?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching posts for artist ${tagName}`)
  }

  return await result.json() as PostWithTags[]
}

export async function fetchHomepagePostsForUserId(userId: number, fromDate: Date): Promise<PostWithTags[]> {
  const queryParams = { from: fromDate.toISOString() }

  const result = await fetch(`${config.BACKEND_URL}/posts/home/${userId}?${qs.stringify(queryParams)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching homepage posts for user ID ${userId}`)
  }

  const postsWithTags = await result.json() as PostWithTags[]

  return _orderBy(postsWithTags, [pwt => pwt.post.publishedAt], ["desc"])
}
