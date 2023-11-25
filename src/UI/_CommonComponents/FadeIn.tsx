import classNames from "classnames"
import { AnimationScope, motion } from "framer-motion"
import { ReactNode } from "react"

import { defaultFadeInDelay } from "../../Util/AnimationUtils.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  animationScope?: AnimationScope;
}

export function FadeIn({ children, delay = defaultFadeInDelay, className = "", animationScope }: Props) {
  return (
    <motion.div
      ref={animationScope}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: s.animationDurationSm, delay }}
      className={classNames("fade-in", className)}
    >
      {children}
    </motion.div>
  )
}
