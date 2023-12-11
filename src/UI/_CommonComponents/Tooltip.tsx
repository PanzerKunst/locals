import { Close } from "@mui/icons-material"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./Tooltip.scss"

const motionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

type Props = {
  text: string;
  visible?: boolean;
}

export function Tooltip({ text, visible = true }: Props) {
  const [isVisible, setIsVisible] = useState(visible)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={motionVariants.initial}
          animate={motionVariants.animate}
          exit={motionVariants.initial}
          transition={{ duration: Number(s.animationDurationXs) }}
          className="tooltip"
        >
          <span>{text}</span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={{ duration: Number(s.animationDurationXs) }}
            className="button icon-only"
            onClick={() => setIsVisible(false)}
          >
            <Close/>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}