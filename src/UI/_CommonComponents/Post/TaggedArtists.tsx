import { Link } from "react-router-dom"

import { Artist } from "../../../Data/Backend/Models/Artist.ts"
import { asTag } from "../../../Util/PostUtils.ts"

type Props = {
  taggedArtists: Artist[]
}

export function TaggedArtists({ taggedArtists }: Props) {
  return (
    <ul className="styleless artist-tags">
      {taggedArtists.map(artist => {
        const tag = asTag(artist.name, "@")

        return (
          <li key={artist.id}>
            <Link to={`/${tag}`} className="underlined appears">{tag}</Link>
          </li>
        )
      })}
    </ul>
  )
}
