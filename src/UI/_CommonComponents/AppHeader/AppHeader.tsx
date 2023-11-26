import { ElectricBolt } from "@mui/icons-material"
import { MouseEvent, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import { AppMenu } from "./AppMenu.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { scrollIntoView } from "../../../Util/AnimationUtils.ts"

import "./AppHeader.scss"

const headerHeight = 60
let lastScrollY = window.scrollY

export function AppHeader() {
  const { spotifyApiAccessToken } = useAppContext()
  const headerRef = useRef<HTMLHeadingElement>(null)
  const isLoggedIn = !!spotifyApiAccessToken
  const homeUrl = isLoggedIn ? "/home" : "/"

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
        <Link to={homeUrl} className="button icon-only">
          <ElectricBolt/>
        </Link>
        <div>
          <a href="/#the-problem" onClick={handleLinkClick} className="underline appears">The problem</a>
          <a href="/#the-solution" onClick={handleLinkClick} className="underline appears">The solution</a>
        </div>
      </nav>
      <AppMenu/>
    </header>
  )
}
