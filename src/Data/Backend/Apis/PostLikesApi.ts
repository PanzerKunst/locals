import { config } from "../../../config.ts"
import { Likes } from "../Models/LikeWithMore.ts"
import { User } from "../Models/User.ts"

export async function storePostLike(postId: number, user: User): Promise<void> {
  const result = await fetch(`${config.BACKEND_URL}/post/like/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user })
  })

  if (!result.ok) {
    throw new Error("Error while storing post like")
  }
}

export async function deletePostLike(postId: number, user: User): Promise<void> {
  const result = await fetch(`${config.BACKEND_URL}/post/like/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user })
  })

  if (!result.ok) {
    throw new Error("Error while deleting post like")
  }
}

export async function fetchPostLikes(postId: number, loggedInUser: User | undefined): Promise<Likes> {
  const result = await fetch(`${config.BACKEND_URL}/post/likes/${postId}/${loggedInUser?.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error(`Error while fetching likes for post ID ${postId}`)
  }

  return await result.json() as Likes
}
