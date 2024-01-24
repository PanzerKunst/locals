import { Artist } from "./Artist.ts"
import { MusicGenre } from "./MusicGenre.ts"

export type ArtistWithAvatarAndGenres = {
  artist: Artist,
  avatarUrl: string,
  genres: MusicGenre[]
}
