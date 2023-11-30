// Taken by copy/pasting the last part of the bubble when hovering `artists.$inferInsert` in file DrizzleModels.ts
export type NewMusicGenre = {
  name: string
}

// Taken by copy/pasting the last part of the bubble when hovering `artists.$inferSelect` in file DrizzleModels.ts
export type MusicGenre = NewMusicGenre & {
  id: number,
  createdAt: string,
  updatedAt: string
}
