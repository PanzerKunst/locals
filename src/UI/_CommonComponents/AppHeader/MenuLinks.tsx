import { motion, stagger, useAnimate } from "framer-motion"
import { useEffect } from "react"
import { Link } from "react-router-dom"

const motionVariants = {
  initial: {
    opacity: 0,
    scale: 0.3,
    filter: "blur(20px)"
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)"
  }
}

export function MenuLinks() {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(
      "li",
      motionVariants.animate,
      {
        duration: 0.2,
        delay: stagger(0.1, { startDelay: 0.2 })
      }
    )
  }, [animate, scope])

  return (
    <ul ref={scope} className="styleless">
      <motion.li initial={motionVariants.initial}>
        <Link to="/profile" className="underline appears">My Profile</Link>
      </motion.li>
      <motion.li initial={motionVariants.initial}>
        <Link to="/?action=signOut" className="underline appears">Sign out</Link>
      </motion.li>
    </ul>
  )
}
