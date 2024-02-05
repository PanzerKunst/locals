import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AnimatePresence, motion } from "framer-motion"

import { User } from "../../../Data/Backend/Models/User.ts"
import { FadeIn } from "../../_CommonComponents/FadeIn.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

const motionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

type Props = {
  authors: User[];
  unfollowed: User[];
  onToggle: (author: User) => void; // eslint-disable-line no-unused-vars
}

export function FollowedAuthors({ authors, unfollowed, onToggle }: Props) {
  const handleToggle = (author: User) => {
    onToggle(author)
  }

  return (
    <ul className="styleless following authors">
      {authors.map((author) => {
        const { avatarUrl } = author
        const isActive = !unfollowed.some((followedAuthor) => followedAuthor.id === author.id)

        return (
          <motion.li
            key={author.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggle(author)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected={isActive}
          >
            <FadeIn>
              {avatarUrl && <img src={avatarUrl} alt="artist-avatar"/>}
              <span>{author.name}</span>

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
