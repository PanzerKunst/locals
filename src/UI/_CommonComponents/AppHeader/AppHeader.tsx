import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { AppMenu } from "./AppMenu.tsx"
import { useAppContext } from "../../../AppContext.tsx"

import classNames from "classnames"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./AppHeader.scss"

const headerHeight = parseInt(s.headerHeight!)
const heroPictureMinHeight = parseInt(s.heroPictureMinHeight!)
let lastScrollY = window.scrollY

export function AppHeader() {
  const { loggedInUser } = useAppContext()
  const location = useLocation()
  const headerRef = useRef<HTMLHeadingElement>(null)
  const [isDarkBg, setIsDarkBg] = useState(false)

  const isHeroPicture = useMemo(() => {
    const isPicture = location.pathname === "/"
    setIsDarkBg(isPicture)
    return isPicture
  }, [location.pathname])


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

      if (isHeroPicture) {
        setIsDarkBg(currentScrollY < heroPictureMinHeight)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHeroPicture])

  return (
    <header ref={headerRef} className={classNames("app-header", { dark: isDarkBg })} style={{ top: 0 }}>
      <Link to={loggedInUser ? "/home" : "/"} className="button icon-only" aria-label="home">
        <img src="/images/icon.svg" alt="logo"/>
      </Link>
      {loggedInUser ? <AppMenu/> :
        <Link to="/home" className="underlined appears"><span>Sign in</span></Link>
      }
    </header>
  )
}
