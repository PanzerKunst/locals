import classNames from "classnames"
import { motion, AnimationControls, useAnimation } from "framer-motion"
import { ReactNode, useRef, useEffect } from "react"

import "./ScrollToVisible.scss"

type Props = {
  children: ReactNode;
  className?: string;
}

const motionVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

export function ScrollToVisible({ children, className = "" }: Props) {
  const controls: AnimationControls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        controls.start("visible")
      }
    })

    const element = ref.current

    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [controls])

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={motionVariants}
      className={classNames("scroll-to-visible", className)}
    >
      {children}
    </motion.span>
  )
}
