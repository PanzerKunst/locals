export type NewUser = {
  name: string,
  spotifyId: string,
  email: string
}

export type User = NewUser & {
  id: number
  createdAt: string
  updatedAt?: string
}
