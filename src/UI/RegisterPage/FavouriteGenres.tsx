import { Check } from "@mui/icons-material"
import { AnimatePresence, motion } from "framer-motion"

import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./FavouriteGenres.scss"

const modalMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

type Props = {
  favourites: string[];
  followed: string[];
  onToggle: (genreName: string) => void; // eslint-disable-line no-unused-vars
}

export function FavouriteGenres({ favourites, followed, onToggle }: Props) {
  const top5genres = favourites.slice(0, 10)

  return (
    <ul className="styleless favourite-genres">
      {top5genres.map((genreName) => {
        const isFollowed = followed.includes(genreName)

        return (
          <motion.li
            key={genreName}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(genreName)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected={isFollowed}
          >
            <FadeIn>
              <span>{genreName}</span>

              <AnimatePresence>
                {isFollowed && <motion.div
                  initial={modalMotionVariants.initial}
                  animate={modalMotionVariants.animate}
                  exit={modalMotionVariants.initial}
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
