import { animate } from "framer-motion"
import { MouseEvent } from "react"
import { Link } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"

import "./AppHeader.scss"

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
      })
    }
  }

  return (
    <header className="app-header container">
      <nav>
        <Link to={homeUrl} className="underline-appears">Home</Link>
        <div>
          <a href="#the-problem" onClick={handleLinkClick} className="underline-appears">The problem</a>
          <a href="#the-solution" onClick={handleLinkClick} className="underline-disappears">The solution</a>

          {/* <IconButton aria-label="menu">
            <Menu/>
          </IconButton> */}
        </div>
      </nav>
    </header>
  )
}
