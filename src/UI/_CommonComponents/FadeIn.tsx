import classNames from "classnames"
import { motion } from "framer-motion"
import { ReactNode } from "react"

import s from "/src/UI/_GlobalStyles/_exports.module.scss"
import "./FadeIn.scss"

type Props = {
  children: ReactNode;
  className?: string;
}

export function FadeIn({ children, className = "" }: Props) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: s.animationDurationShort }}
      className={classNames("scroll-to-visible", className)}
    >
      {children}
    </motion.span>
  )
}
