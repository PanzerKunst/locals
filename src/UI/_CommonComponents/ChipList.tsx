import { Check, Close } from "@mui/icons-material"
import { motion } from "framer-motion"
import _isEqual from "lodash/isEqual"
import { ReactNode } from "react"

import { FadeIn } from "./FadeIn.tsx"


import "./ChipList.scss"

type Props<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode; // eslint-disable-line no-unused-vars
  activeItems?: T[];
  onDelete?: (item: T) => void; // eslint-disable-line no-unused-vars
  onToggle?: (item: T) => void; // eslint-disable-line no-unused-vars
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
    return onDelete ? <Close/> : <Check/>
  }

  return (
    <ul className="styleless chips">
      {items.map((item) => {
        const isActive = activeItems.some((activeItem: T) => _isEqual(item, activeItem))

        return (
          <motion.li
            key={JSON.stringify(item)}
            whileTap={{ scale: 0.97 }}
            onClick={() => onClick(item)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected={isActive}
          >
            <FadeIn>
              {renderItem(item)}
              <Icon/>
            </FadeIn>
          </motion.li>
        )
      })}
    </ul>
  )
}
