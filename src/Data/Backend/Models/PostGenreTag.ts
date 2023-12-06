// Taken by copy/pasting the last part of the bubble when hovering `postGenreTags.$inferInsert`
export type NewPostGenreTag = {
  postId: number,
  genreId: number,
}

// Taken by copy/pasting the last part of the bubble when hovering `postGenreTags.$inferSelect`
export type PostGenreTag = NewPostGenreTag & {
  id: number,
  createdAt: string,
  updatedAt: string,
}
