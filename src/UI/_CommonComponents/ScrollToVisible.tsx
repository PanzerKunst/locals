import * as classNames from "classnames"
import { motion, AnimationControls, useAnimation } from "framer-motion"
import { ReactNode, useRef, useEffect } from "react"

import "./ScrollToVisible.scss"

type Props = {
  children: ReactNode;
  className?: string;
}

export function ScrollToVisible({ children, className = "" }: Props) {
  const controls: AnimationControls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)

  const variants = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        controls.start("visible")
      }
    },
    {
      root: undefined, // relative to the viewport
      rootMargin: "0px",
      threshold: 0.1 // triggers when 10% of the element is visible
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
      variants={variants}
      className={classNames("scroll-to-visible", className)}
    >
      {children}
    </motion.span>
  )
}
