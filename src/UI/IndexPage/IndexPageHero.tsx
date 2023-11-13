import { motion } from "framer-motion"

import "./IndexPageHero.scss"

const variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

export function IndexPageHero() {
  return (
    <section id="hero">
      <h1>
        <motion.span
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7 }}
          variants={variants}
        >
          Connect with your
        </motion.span>
        <motion.span
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 0.3 }}
          variants={variants}
        >
          favourite artists
        </motion.span>
      </h1>
    </section>
  )
}
