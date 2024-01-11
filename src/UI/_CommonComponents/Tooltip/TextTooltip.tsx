import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import { TooltipPosition } from "./Tooltip.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./Tooltip.scss"

type Props = {
  onClose: () => void;
  text: string;
  position?: TooltipPosition;
}

export function TextTooltip({ onClose, text, position = "top" }: Props) {
  return (
    <div className={classNames("tooltip text", position)}>
      <span>{text}</span>

      <motion.button
        whileTap={{ scale: 0.9 }}
        transition={{ duration: Number(s.animationDurationXs) }}
        className="button icon-only light"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faXmark}/>
      </motion.button>
    </div>
  )
}
