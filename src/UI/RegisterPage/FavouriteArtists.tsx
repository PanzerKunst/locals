import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"

import { SpotifyArtist } from "../../Data/Spotify/Models/SpotifyArtist.ts"
import { useViewportSize } from "../../Util/BrowserUtils.ts"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { Tooltip } from "../_CommonComponents/Tooltip.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./FavouriteArtists.scss"

const motionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

function getItemCount(isShowingAll: boolean, viewportWidth: number) {
  const viewportWidthMd = parseInt(s.vwMd || "")
  const viewportWidthLg = parseInt(s.vwLg || "")
  const viewportWidthXl = parseInt(s.vwXl || "")

  if (isShowingAll) {
    return 500
  }

  const rowCount = 3
  const minColumnCount = 2

  if (viewportWidth < viewportWidthMd) {
    return rowCount * minColumnCount
  } else if (viewportWidth < viewportWidthLg) {
    return rowCount * (minColumnCount + 1)
  } else if (viewportWidth < viewportWidthXl) {
    return rowCount * (minColumnCount + 2)
  }

  return rowCount * (minColumnCount + 3)
}

type Props = {
  favourites: SpotifyArtist[];
  followed: SpotifyArtist[];
  isShowingAll?: boolean;
  onToggle: (spotifyArtist: SpotifyArtist) => void; // eslint-disable-line no-unused-vars
}

export function FavouriteArtists({ isShowingAll = false, favourites, followed, onToggle }: Props) {
  const viewportWidth = useViewportSize().width
  const [isTooltipVisible, setIsTooltipVisible] = useState(true)

  // const artistsByPopularity = favourites.sort((a, b) => b.popularity - a.popularity)
  const topArtists = favourites.slice(0, getItemCount(isShowingAll, viewportWidth))

  const handleToggle = (spotifyArtist: SpotifyArtist) => {
    setIsTooltipVisible(false)
    onToggle(spotifyArtist)
  }

  return (
    <ul className="styleless favourite-artists">
      {isTooltipVisible && <Tooltip text="Tap to toggle" />}
      {topArtists.map((spotifyArtist) => {
        const largeImage = spotifyArtist.images[0]
        const isActive = followed.some((followedArtist) => followedArtist.id === spotifyArtist.id)

        return (
          <motion.li
            key={spotifyArtist.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggle(spotifyArtist)}
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
                  <FontAwesomeIcon icon={faCheck} />
                </motion.div>}
              </AnimatePresence>
            </FadeIn>
          </motion.li>
        )
      })}
    </ul>
  )
}
