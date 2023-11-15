import { ElectricBolt } from "@mui/icons-material"
import { animate, AnimationControls, motion, useAnimation } from "framer-motion"
import { MouseEvent, useEffect } from "react"
import { Link } from "react-router-dom"

import { AppMenu } from "./AppMenu.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { easeOutFast } from "../../../Util/AnimationUtils.ts"

import s from "/src/UI/_GlobalStyles/_exports.module.scss"

import "./AppHeader.scss"

let lastScrollY = window.scrollY
let isRequestAnimationFrameTicking = false

const motionVariants = {
  hidden: {
    y: -60, // header height
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
}

export function AppHeader() {
  const { spotifyApiAccessToken } = useAppContext()
  const animationControls: AnimationControls = useAnimation()
  const isLoggedIn = !!spotifyApiAccessToken
  const homeUrl = isLoggedIn ? "/home" : "/"

  /* Doesn't work on iOS
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        animationControls.start("hidden")
      } else {
        animationControls.start("visible")
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [animationControls]) */

  useEffect(() => {
    const handleScroll = () => {
      if (!isRequestAnimationFrameTicking) {
        /* Since scroll events can fire at a high rate, the event handler shouldn't execute computationally expensive
        operations such as DOM modifications. Instead, it is recommended to throttle the event using
        requestAnimationFrame() */
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          if (currentScrollY > lastScrollY) {
            animationControls.start("hidden")
          } else {
            animationControls.start("visible")
          }

          lastScrollY = currentScrollY
          isRequestAnimationFrameTicking = false
        })

        isRequestAnimationFrameTicking = true
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [animationControls])

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    const href = event.currentTarget.getAttribute("href")!
    const sectionElement = document.getElementById(href.replace("#", ""))

    if (sectionElement) {
      const top = sectionElement.offsetTop

      animate(window.scrollY, top, {
        onUpdate: (value) => window.scrollTo(0, value),
        duration: Number(s.animationDurationMedium),
        ease: easeOutFast
      })
    }
  }

  return (
    <motion.header
      initial="visible"
      animate={animationControls}
      variants={motionVariants}
      transition={{ duration: s.animationDurationShort, ease: "easeOut"}}
      className="app-header"
    >
      <nav>
        <Link to={homeUrl} className="button icon-only">
          <ElectricBolt/>
        </Link>
        <div>
          <a href="#the-problem" onClick={handleLinkClick} className="underline appears">The problem</a>
          <a href="#the-solution" onClick={handleLinkClick} className="underline appears">The solution</a>
        </div>
      </nav>
      <AppMenu/>
    </motion.header>
  )
}
