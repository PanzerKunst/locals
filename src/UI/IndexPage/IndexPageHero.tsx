import { motion } from "framer-motion"

import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"

import { Link } from "react-router-dom"

import s from "/src/UI/_GlobalStyles/_exports.module.scss"
import "./IndexPageHero.scss"

const motionVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

const motionTransition = {
  duration: s.animationDurationMedium,
  ease: "easeIn"
}

export function IndexPageHero() {
  return (
    <section id="hero">
      <h1>
        <motion.span
          initial="hidden"
          animate="visible"
          transition={motionTransition}
          variants={motionVariants}
        >
          Connect with your
        </motion.span>
        <motion.span
          initial="hidden"
          animate="visible"
          transition={{...motionTransition, delay: 0.3 }}
          variants={motionVariants}
        >
          favourite artists
        </motion.span>
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: s.animationDurationShort, delay: 1 }}
      >
        <AnimatedButton className="filling">
          <Link to="/home" className="button skewed"><span>Get started</span></Link>
        </AnimatedButton>
      </motion.div>
    </section>
  )
}
