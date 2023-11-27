// Taken by copy/pasting the last part of the bubble when hovering `artists.$inferInsert`
export type NewArtist = {
  spotifyId: string,
  name: string
}

// Taken by copy/pasting the last part of the bubble when hovering `artists.$inferSelect`
export type Artist = NewArtist & {
  id: number,
  createdAt: string,
  updatedAt: string,
}
