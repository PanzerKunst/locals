import { ElectricBolt } from "@mui/icons-material"
import classNames from "classnames"
import { animate } from "framer-motion"
import { MouseEvent, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { AppMenu } from "./AppMenu.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { easeOutFast } from "../../../Util/AnimationUtils.ts"


import s from "/src/UI/_GlobalStyles/_exports.module.scss"

import "./AppHeader.scss"

let isRequestAnimationFrameTicking = false

export function AppHeader() {
  const { spotifyApiAccessToken } = useAppContext()
  const [isScrolledDown, setIsScrolledDown] = useState(false)

  const isLoggedIn = !!spotifyApiAccessToken
  const homeUrl = isLoggedIn ? "/home" : "/"

  useEffect(() => {
    handleMenuShadow()
  }, [])

  function handleMenuShadow() {
    document.addEventListener("scroll", () => {
      const lastKnownScrollPosition = window.scrollY

      if (!isRequestAnimationFrameTicking) {
        /* Since scroll events can fire at a high rate, the event handler shouldn't execute computationally expensive
        operations such as DOM modifications. Instead, it is recommended to throttle the event using
        requestAnimationFrame() */
        window.requestAnimationFrame(() => {
          setIsScrolledDown(lastKnownScrollPosition > 0)
          isRequestAnimationFrameTicking = false
        })

        isRequestAnimationFrameTicking = true
      }
    })
  }

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
    <header className={classNames("app-header", { "scrolled-down": isScrolledDown })}>
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
