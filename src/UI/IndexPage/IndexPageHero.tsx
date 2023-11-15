import { motion } from "framer-motion"

import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"

import { Link } from "react-router-dom"

import { easeOutFast } from "../../Util/AnimationUtils.ts"

import s from "/src/UI/_GlobalStyles/_exports.module.scss"
import "./IndexPageHero.scss"

const motionVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 }
}

const motionTransition = {
  duration: s.animationDurationMedium,
  ease: easeOutFast
}

export function IndexPageHero() {
  return (
    <section id="hero">
      <h1>
        <motion.span
          initial="initial"
          animate="animate"
          variants={motionVariants}
          transition={motionTransition}
        >
          Connect with your
        </motion.span>
        <motion.span
          initial="initial"
          animate="animate"
          variants={motionVariants}
          transition={{...motionTransition, delay: 0.3 }}
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
