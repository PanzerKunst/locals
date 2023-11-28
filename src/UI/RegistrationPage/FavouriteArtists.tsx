import { Check } from "@mui/icons-material"
import { motion } from "framer-motion"

import { SpotifyArtist } from "../../Data/Spotify/Models/SpotifyArtist.ts"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import "./FavouriteArtists.scss"

type Props = {
  spotifyArtists: SpotifyArtist[];
  onToggle: (spotifyArtist: SpotifyArtist) => void; // eslint-disable-line no-unused-vars
}

export function FavouriteArtists({ spotifyArtists, onToggle }: Props) {
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
        const largeImage = spotifyArtist.images[0]

        return (
          <motion.li whileTap={{ scale: 0.97 }}
            key={spotifyArtist.id}
            /* onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} */
            onClick={() => onToggle(spotifyArtist)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected="false"
          >
            <FadeIn>
              {largeImage && <img src={largeImage.url} alt="artist-avatar"/>}
              <span className="artist-name">{spotifyArtist.name}</span>
              <Check/>
            </FadeIn>
          </motion.li>
        )
      })}
    </ul>
  )
}
