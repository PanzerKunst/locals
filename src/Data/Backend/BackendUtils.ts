import { PostWithAuthorAndTags } from "./Models/PostWithTags.ts"
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

export function getPostPath(postWithAuthorAndTags: PostWithAuthorAndTags): string {
  const { post, author } = postWithAuthorAndTags
  return `/@${author.username}/${post.slug}`
}
