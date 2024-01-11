import classNames from "classnames"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormControl, Input } from "@mui/joy"
import { motion } from "framer-motion"
import { KeyboardEvent, useState } from "react"

import { TooltipPosition } from "./Tooltip.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./Tooltip.scss"

type Props = {
  onClose: () => void;
  onSubmit: (value: string) => void; // eslint-disable-line no-unused-vars
  position?: TooltipPosition;
}

export function InputTooltip({ onClose, onSubmit, position = "top" }: Props) {
  const [value, setValue] = useState("")

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit(value)
      onClose()
    }
  }

  return (
    <div className={classNames("tooltip input", position)}>
      <FormControl id="tooltip-input">
        <Input
          variant="soft"
          size="lg"
          className="offset"
          value={value}
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </FormControl>

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
