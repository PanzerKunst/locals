import { Close, Menu } from "@mui/icons-material"
import { motion } from "framer-motion"
import { useState } from "react"

import s from "/src/UI/_GlobalStyles/_exports.module.scss"
import "./AppMenu.scss"

const motionVariants = {
  visible: { scale: 1 },
  hidden: { scale: 0 }
}

const motionTransition = {
  duration: Number(s.animationDurationShort),
  ease: "easeInOut"
}

export function AppMenu() {
  const [hasMenuButtonBeenClicked, setHasMenuButtonBeenClicked] = useState(false)
  const [isMenuIconShown, setIsMenuIconShown] = useState(true)
  const [isAppearing, setIsAppearing] = useState(false)

  const toggleMenu = () => {
    setHasMenuButtonBeenClicked(true)
    setIsAppearing(false)

    setTimeout(() => {
      setIsMenuIconShown(!isMenuIconShown)
      setIsAppearing(true)
    }, motionTransition.duration * 1000)
  }

  function getAnimateStatus() {
    if (!hasMenuButtonBeenClicked) {
      return "visible"
    }

    return isAppearing ? "visible" : "hidden"
  }

  return (
    <button className="icon-only menu" onClick={toggleMenu}>
      <motion.div
        initial={isAppearing ? "hidden" : "visible"}
        animate={getAnimateStatus()}
        variants={motionVariants}
        transition={motionTransition}
      >
        {isMenuIconShown ? <Menu/> : <Close/>}
      </motion.div>
    </button>
  )
}
