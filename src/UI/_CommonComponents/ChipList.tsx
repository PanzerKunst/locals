import { AnimatePresence, motion } from "framer-motion"
import _isEqual from "lodash/isEqual"
import { ReactNode } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./ChipList.scss"

type Props<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode; // eslint-disable-line no-unused-vars
  activeItems?: T[];
  onDelete?: (item: T) => void; // eslint-disable-line no-unused-vars
  onToggle?: (item: T) => void; // eslint-disable-line no-unused-vars
}

const motionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export function ChipList<T>({ items, renderItem, activeItems = [], onDelete, onToggle }: Props<T>) {
  if (!onDelete && !onToggle) {
    throw new Error("Either onDelete or onToggle must be defined")
  }

  if (onDelete && onToggle) {
    throw new Error("Either onDelete or onToggle must be defined, not both")
  }

  const onClick = onDelete || onToggle!

  function Icon() {
    return onDelete ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faCheck} />
  }

  return (
    <ul className="styleless chips">
      <AnimatePresence>
        {items.map((item) => {
          const isActive = !onToggle || activeItems.some((activeItem: T) => _isEqual(item, activeItem))

          return (
            <motion.li
              key={JSON.stringify(item)}
              whileTap={{ scale: 0.95 }}
              onClick={() => onClick(item)}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="option"
              aria-selected={isActive}

              initial={motionVariants.initial}
              animate={motionVariants.animate}
              exit={motionVariants.initial}
              transition={{ duration: Number(s.animationDurationXs) }}
            >
              {renderItem(item)}
              <Icon/>
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
