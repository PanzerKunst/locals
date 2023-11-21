import { SpotifyArtist } from "../../Data/SpotifyModels/SpotifyArtist.ts"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import "./FavouriteArtists.scss"

type Props = {
  spotifyArtists: SpotifyArtist[];
}

export function FavouriteArtists({ spotifyArtists }: Props) {
  /* const handleMouseMove = (event: MouseEvent<HTMLLIElement>) => {
    const li = event.currentTarget

    const { width, height, left, top } = li.getBoundingClientRect()
    const mouseX = event.clientX - (left + width / 2)
    const mouseY = event.clientY - (top + height / 2)
    const rotateX = -(mouseY / height) * 30 // tilt factor
    const rotateY = (mouseX / width) * 30 // tilt factor

    li.style.transform = `scale(1.1) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = (event: MouseEvent<HTMLLIElement>) => {
    const li = event.currentTarget
    li.style.transform = "scale(1.1) perspective(1000px) rotateX(0deg) rotateY(0deg)"
  } */

  const artistsByPopularity = spotifyArtists.sort((a, b) => b.popularity - a.popularity)
  const top50artists = artistsByPopularity.slice(0, 50)

  return (
    <ul className="styleless favourite-artists">
      {top50artists.map((spotifyArtist) => {
        const mediumImage = spotifyArtist.images[1]

        return (// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <li key={spotifyArtist.id} /* onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} */>
            <FadeIn delay={0.5}>
              {mediumImage && <img src={mediumImage.url} alt="artist-avatar"/>}
              <span>{spotifyArtist.name}</span>
            </FadeIn>
          </li>
        )
      })}
    </ul>
  )
}
