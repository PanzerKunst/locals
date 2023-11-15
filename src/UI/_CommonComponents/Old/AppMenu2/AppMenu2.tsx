import { useCycle } from "framer-motion"
import { motion } from "framer-motion"

import { Navigation } from "./Navigation.tsx"
import { useViewportSize } from "../../../../Util/BrowserUtils.ts"
import { MenuToggle } from "../../AppMenu3/MenuToggle.tsx"

import "./AppMenu2.scss"

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
}

export function AppMenu2() {
  const [isOpen, toggleOpen] = useCycle(false, true)
  const { height } = useViewportSize()

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      className="app-menu"
    >
      <motion.div className="background" variants={sidebar} />
      <Navigation />
      <MenuToggle onToggle={() => toggleOpen()} />
    </motion.nav>
  )
}