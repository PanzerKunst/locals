export type NewArtist = {
  spotify_id: string;
  name: string;
}

export type Artist = NewArtist & {
  id: number;
  created_at: Date;
  updated_at?: Date;
}
