// Taken by copy/pasting the last part of the bubble when hovering `postArtistTags.$inferInsert`
export type NewPostArtistTag = {
  postId: number,
  artistId: number,
}

// Taken by copy/pasting the last part of the bubble when hovering `postArtistTags.$inferSelect`
export type PostArtistTag = NewPostArtistTag & {
  id: number,
  createdAt: string,
  updatedAt: string,
}
