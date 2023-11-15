import { ElectricBolt } from "@mui/icons-material"
import { animate } from "framer-motion"
import { MouseEvent } from "react"
import { Link } from "react-router-dom"

import { AppMenu } from "./AppMenu.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { easeOutFast } from "../../../Util/AnimationUtils.ts"

import "./AppHeader.scss"
import s from "/src/UI/_GlobalStyles/_exports.module.scss"

export function AppHeader() {
  const { spotifyApiAccessToken } = useAppContext()
  const isLoggedIn = !!spotifyApiAccessToken
  const homeUrl = isLoggedIn ? "/home" : "/"

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
    <header className="app-header">
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
