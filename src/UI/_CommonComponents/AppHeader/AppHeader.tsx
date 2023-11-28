import { ElectricBolt } from "@mui/icons-material"
import { MouseEvent, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import { AppMenu } from "./AppMenu.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { scrollIntoView } from "../../../Util/AnimationUtils.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./AppHeader.scss"

const headerHeight = parseInt(s.headerHeight!)
let lastScrollY = window.scrollY

export function AppHeader() {
  const { loggedInUser } = useAppContext()
  const headerRef = useRef<HTMLHeadingElement>(null)
  const homeUrl = loggedInUser ? "/home" : "/"

  useEffect(() => {
    const header = headerRef.current

    if (!header) {
      return
    }

    function handleScroll() {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY
      const headerTopPos = parseInt(header!.style.top)

      // Header always shown when scrolled near the top
      let newTopPos = 0

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) { // Scrolling down
          const isHeaderFullyHidden = headerTopPos === -headerHeight

          newTopPos = isHeaderFullyHidden
            ? -headerHeight
            : Math.max(headerTopPos - delta, -headerHeight)

        } else { // Scrolling up
          const isHeaderFullyVisible = headerTopPos === 0

          newTopPos = isHeaderFullyVisible
            ? 0
            : Math.min(headerTopPos - delta, 0)
        }
      }

      header!.style.top = `${newTopPos}px`

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault() // TODO: only if already on index page

    const href = event.currentTarget.getAttribute("href")!
    const sectionElement = document.getElementById(href.replace("/#", ""))
    scrollIntoView(sectionElement)
  }

  return (
    <header ref={headerRef} className="app-header" style={{ top: 0 }}>
      <nav>
        <Link to={homeUrl} className="button icon-only" aria-label="home">
          <ElectricBolt/>
        </Link>
        <div>
          <a href="/#for-artists" onClick={handleLinkClick} className="underline appears">For artists</a>
          <a href="/#for-fans" onClick={handleLinkClick} className="underline appears">For fans</a>
        </div>
      </nav>
      <AppMenu/>
    </header>
  )
}
