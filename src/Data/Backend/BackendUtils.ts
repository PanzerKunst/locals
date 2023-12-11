import { Post } from "./Models/Post.ts"
import { User } from "./Models/User.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { SpotifyArtist } from "../Spotify/Models/SpotifyArtist.ts"

export function getFavouriteGenresFromArtists(spotifyArtists: SpotifyArtist[]): string[] {
  const genreCounts = new Map<string, number>()

  spotifyArtists.forEach(artist => {
    artist.genres.forEach(genreName => {
      const currentCount = genreCounts.get(genreName) || 0
      genreCounts.set(genreName, currentCount + 1)
    })
  })

  return Array.from(genreCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre)
}

export function getPostSlug(postTitle: string | undefined): string | undefined {
  if (postTitle && postTitle.length > 0) {
    // We take the first 7 words, and replace spaces with dashes
    return postTitle.toLowerCase().split(" ").slice(0, 7).join("-")
  }

  return undefined
}

export function getPostPath(post: Post, author: User): string {
  const postSlug = getPostSlug(post.title)

  const pathSuffix = postSlug
    ? `${postSlug}?${appUrlQueryParam.POST_ID}=${post.id}`
    : post.id.toString()

  return `@${author.username}/${pathSuffix}`
}

type SlugAndId = {
  slug?: string,
  id?: number
}

export function getPostSlugAndIdFromSlugOrId(slugOrId: string | undefined): SlugAndId {
  if (!slugOrId) {
    return {}
  }

  if (isNaN(Number(slugOrId))) {
    return { slug: slugOrId }
  }

  return { id: Number(slugOrId) }
}
