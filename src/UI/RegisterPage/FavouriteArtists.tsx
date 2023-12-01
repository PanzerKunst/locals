import { Check } from "@mui/icons-material"
import { AnimatePresence, motion } from "framer-motion"

import { SpotifyArtist } from "../../Data/Spotify/Models/SpotifyArtist.ts"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./FavouriteArtists.scss"

const motionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

type Props = {
  favourites: SpotifyArtist[];
  followed: SpotifyArtist[];
  onToggle: (spotifyArtist: SpotifyArtist) => void; // eslint-disable-line no-unused-vars
}

export function FavouriteArtists({ favourites, followed, onToggle }: Props) {
  const artistsByPopularity = favourites.sort((a, b) => b.popularity - a.popularity)
  const top50artists = artistsByPopularity.slice(0, 50)

  return (
    <ul className="styleless favourite-artists">
      {top50artists.map((spotifyArtist) => {
        const largeImage = spotifyArtist.images[0]
        const isActive = followed.some((followedArtist) => followedArtist.id === spotifyArtist.id)

        return (
          <motion.li
            key={spotifyArtist.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(spotifyArtist)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected={isActive}
          >
            <FadeIn>
              {largeImage && <img src={largeImage.url} alt="artist-avatar"/>}
              <span className="artist-name">{spotifyArtist.name}</span>

              <AnimatePresence>
                {isActive && <motion.div
                  initial={motionVariants.initial}
                  animate={motionVariants.animate}
                  exit={motionVariants.initial}
                  transition={{ duration: Number(s.animationDurationXs) }}
                  className="check-icon-wrapper"
                >
                  <Check/>
                </motion.div>}
              </AnimatePresence>
            </FadeIn>
          </motion.li>
        )
      })}
    </ul>
  )
}
