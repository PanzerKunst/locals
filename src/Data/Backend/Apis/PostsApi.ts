import Quill from "quill"

import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { Post, EmptyPost } from "../Models/Posts.ts"

export async function fetchPost(id: number): Promise<Post | undefined> {
  const result = await fetch(`${config.BACKEND_URL}/post/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while fetching post")
  }

  return result.status === httpStatusCode.NO_CONTENT
    ? undefined
    : await result.json() as Post
}

export async function storePost(appContext: AppContextType, quill: Quill): Promise<Post> {
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
        content: quill.root.innerHTML
      }
    })
  })

  if (!result.ok) {
    throw new Error(`Error while storing post for user ID ${loggedInUser.id}`)
  }

  return await result.json() as Post
}

export async function updatePost(emptyPost: EmptyPost, quill: Quill): Promise<Post> {
  const result = await fetch(`${config.BACKEND_URL}/post`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post: {
        ...emptyPost,
        content: quill.root.innerHTML
      }
    })
  })

  if (!result.ok) {
    throw new Error(`Error while updating post ${JSON.stringify(emptyPost)}`)
  }

  return await result.json() as Post
}
