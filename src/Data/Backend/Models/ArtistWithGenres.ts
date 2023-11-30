import { Artist } from "./Artist.ts"
import { MusicGenre } from "./MusicGenre.ts"

export type ArtistWithGenres = {
  artist: Artist,
  genres: MusicGenre[]
}
