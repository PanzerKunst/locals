import { ElectricBolt } from "@mui/icons-material"
import { useAnimate } from "framer-motion"
import { MouseEvent, useEffect } from "react"
import { Link } from "react-router-dom"

import { AppMenu } from "./AppMenu.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { easeOutFast, MotionTransition } from "../../../Util/AnimationUtils.ts"
import { isTouch } from "../../../main.tsx"

import s from "/src/UI/_GlobalStyles/_exports.module.scss"
import "./AppHeader.scss"

let lastScrollY = window.scrollY

const motionVariants = {
  hidden: {
    y: -60, // header height
    // opacity: 0 doesn't look good enough
  },
  visible: {
    y: 0,
    // opacity: 1 doesn't look good enough
  }
}

const motionTransition: MotionTransition = {
  duration: Number(s.animationDurationShort),
  ease: "easeOut"
}

export function AppHeader() {
  const { spotifyApiAccessToken } = useAppContext()
  const [scope, animate] = useAnimate()
  const isLoggedIn = !!spotifyApiAccessToken
  const homeUrl = isLoggedIn ? "/home" : "/"

  useEffect(() => {
    if (isTouch) {
      return // Because animations based on scroll position are buggy on mobile, especially iOS
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        animate(scope.current, motionVariants.hidden, motionTransition)
      } else {
        animate(scope.current, motionVariants.visible, motionTransition)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [animate, scope])

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
    <header ref={scope} className="app-header">
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
    </header>
  )
}
