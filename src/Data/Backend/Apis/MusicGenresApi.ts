import { config } from "../../../config.ts"
import { MusicGenre } from "../Models/MusicGenre.ts"

export async function fetchAllMusicGenres(): Promise<MusicGenre[]> {
  const result = await fetch(`${config.BACKEND_URL}/musicGenres`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })

  if (!result.ok) {
    throw new Error("Error while fetching music genres")
  }

  return await result.json() as MusicGenre[]
}
