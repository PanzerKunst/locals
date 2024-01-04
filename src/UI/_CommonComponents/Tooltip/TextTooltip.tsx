import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import { tooltipMotionVariants, TooltipPosition } from "./Tooltip.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./Tooltip.scss"

type Props = {
  text: string;
  visible?: boolean;
  position?: TooltipPosition;
}

export function TextTooltip({ text, visible = true, position = "top" }: Props) {
  const [isVisible, setIsVisible] = useState(visible)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={tooltipMotionVariants.initial}
          animate={tooltipMotionVariants.animate}
          exit={tooltipMotionVariants.initial}
          transition={{ duration: Number(s.animationDurationXs) }}
          className={classNames("tooltip text", position)}
        >
          <span>{text}</span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={{ duration: Number(s.animationDurationXs) }}
            className="button icon-only light"
            onClick={() => setIsVisible(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}