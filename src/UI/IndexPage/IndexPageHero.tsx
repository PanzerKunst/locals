import { motion } from "framer-motion"
import { Link } from "react-router-dom"

import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"

import "./IndexPageHero.scss"

const headingVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

const buttonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export function IndexPageHero() {
  return (
    <section id="hero">
      <h1>
        <motion.span
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7 }}
          variants={headingVariants}
        >
          Connect with your
        </motion.span>
        <motion.span
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 0.3 }}
          variants={headingVariants}
        >
          favourite artists
        </motion.span>
      </h1>

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 1 }}
        variants={buttonVariants}
      >
        <AnimatedButton className="filling">
          <Link to="/home" className="button skewed"><span>Get started</span></Link>
        </AnimatedButton>
      </motion.div>
    </section>
  )
}
