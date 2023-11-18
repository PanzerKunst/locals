export type NewArtist = {
  name: string
  spotifyId: string
}

export type Artist = NewArtist & {
  id: number
  createdAt: string
  updatedAt?: string
}
