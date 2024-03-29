import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import { Artist } from "../../../Data/Backend/Models/Artist.ts"
import { ArtistWithFollowStatus } from "../../../Data/Backend/Models/ArtistWithMore.ts"
import { FadeIn } from "../../_CommonComponents/FadeIn.tsx"
import { TextTooltip } from "../../_CommonComponents/Tooltip/TextTooltip.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

const motionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

type Props = {
  artistWithFollowStatus: ArtistWithFollowStatus[];
  onToggle: (artist: Artist) => void; // eslint-disable-line no-unused-vars
}

export function FollowedArtists({ artistWithFollowStatus, onToggle }: Props) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true)

  const handleToggle = (artist: Artist) => {
    setIsTooltipVisible(false)
    onToggle(artist)
  }

  return (
    <ul className="styleless following artists">
      {isTooltipVisible && <TextTooltip onClose={() => setIsTooltipVisible(false)} text="Tap to toggle" />}
      {artistWithFollowStatus.map(({ artist, isFollowed }) => {
        const { avatarUrl } = artist

        return (
          <motion.li
            key={artist.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggle(artist)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected={isFollowed}
          >
            <FadeIn>
              {avatarUrl && <img src={avatarUrl} alt="artist-avatar"/>}
              <span>{artist.name}</span>

              <AnimatePresence>
                {isFollowed && <motion.div
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
