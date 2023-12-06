import Quill from "quill"

import { AppContextType } from "../../../AppContext.tsx"
import { httpStatusCode } from "../../../Util/HttpUtils.ts"
import { config } from "../../../config.ts"
import { ArtistWithGenres } from "../Models/ArtistWithGenres.ts"
import { MusicGenre } from "../Models/MusicGenre.ts"
import { Post } from "../Models/Post.ts"
import { EmptyPostWithTags } from "../Models/PostWithTags.ts"

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

export async function storePost(
  appContext: AppContextType,
  title: string,
  taggedArtistsWithGenres: ArtistWithGenres[],
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
      taggedArtists: taggedArtistsWithGenres.map((artistWithGenres) => artistWithGenres.artist),
      taggedGenres
    })
  })

  if (!result.ok) {
    throw new Error(`Error while storing post for user ID ${loggedInUser.id}`)
  }

  return await result.json() as EmptyPostWithTags
}

export async function updatePost(emptyPostWithTags: EmptyPostWithTags, quill: Quill): Promise<EmptyPostWithTags> {
  const result = await fetch(`${config.BACKEND_URL}/post`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post: {
        ...emptyPostWithTags.post,
        content: quill.root.innerHTML
      },
      taggedArtists: emptyPostWithTags.taggedArtists,
      taggedGenres: emptyPostWithTags.taggedGenres
    })
  })

  if (!result.ok) {
    throw new Error(`Error while updating post ${JSON.stringify(emptyPostWithTags)}`)
  }

  return await result.json() as EmptyPostWithTags
}
