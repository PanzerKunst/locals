import classNames from "classnames"
import { motion } from "framer-motion"
import { ReactNode } from "react"

import { defaultFadeInDelay } from "../../Util/AnimationUtils.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = defaultFadeInDelay, className = "" }: Props) {
  return (
    <motion.div
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
