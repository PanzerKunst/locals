import { Link } from "react-router-dom"

import { Artist } from "../../../Data/Backend/Models/Artist.ts"

type Props = {
  taggedArtists: Artist[]
}

export function TaggedArtists({ taggedArtists }: Props) {
  return (
    <ul className="styleless artist-tags">
      {taggedArtists.map(artist => (
        <li key={artist.id}>
          <Link to={`/@${artist.tagName}`} className="underlined appears">@{artist.tagName}</Link>
        </li>
      ))}
    </ul>
  )
}
