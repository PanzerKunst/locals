import classNames from "classnames"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormControl, Input } from "@mui/joy"
import { AnimatePresence, motion } from "framer-motion"
import { KeyboardEvent, useState } from "react"

import { tooltipMotionVariants, TooltipPosition } from "./Tooltip.ts"

import "./Tooltip.scss"
import s from "/src/UI/_CommonStyles/_exports.module.scss"

type Props = {
  onSubmit: (value: string) => void; // eslint-disable-line no-unused-vars
  visible?: boolean;
  position?: TooltipPosition;
}

export function InputTooltip({ onSubmit, visible = true, position = "top" }: Props) {
  const [isVisible, setIsVisible] = useState(visible)
  const [value, setValue] = useState("")

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit(value)
      setIsVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={tooltipMotionVariants.initial}
          animate={tooltipMotionVariants.animate}
          exit={tooltipMotionVariants.initial}
          transition={{ duration: Number(s.animationDurationXs) }}
          className={classNames("tooltip input", position)}
        >
          <FormControl id="tooltip-input">
            <Input
              variant="soft"
              size="lg"
              className="offset"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </FormControl>

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
