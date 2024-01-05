import classNames from "classnames"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { AppMenu } from "./AppMenu.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { useViewportSize } from "../../../Util/BrowserUtils.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./AppHeader.scss"

const headerHeight = parseInt(s.headerHeight!)
const heroPictureMinHeight = parseInt(s.heroPictureMinHeight!)
let lastScrollY = window.scrollY

export function AppHeader() {
  const { loggedInUser, headerTitle } = useAppContext()
  const location = useLocation()

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")
  const isMobile = viewportWidth < viewportWidthMd

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

    const handleScroll = isMobile ? handleScrollMobile : handleScrollDesktop

    function handleScrollMobile() {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY
      const headerBottomPos = parseInt(header!.style.bottom)

      // Header always shown when scrolled near the top
      let newBottomPos = 0

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) { // Scrolling down
          const isHeaderFullyHidden = headerBottomPos === -headerHeight

          newBottomPos = isHeaderFullyHidden
            ? -headerHeight
            : Math.max(headerBottomPos - delta, -headerHeight)

        } else { // Scrolling up
          const isHeaderFullyVisible = headerBottomPos === 0

          newBottomPos = isHeaderFullyVisible
            ? 0
            : Math.min(headerBottomPos - delta, 0)
        }
      }

      header!.style.bottom = `${newBottomPos}px`

      lastScrollY = currentScrollY
    }

    function handleScrollDesktop() {
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
  }, [isHeroPicture, isMobile])

  return (
    <header
      ref={headerRef}
      className={classNames("app-header", { desktop: !isMobile, mobile: isMobile, dark: isDarkBg })}
      style={isMobile ? { bottom: 0 } : { top: 0 }}
    >
      <div className="placeholder"/>
      {headerTitle && <h2>{headerTitle}</h2>}
      {loggedInUser
        ? <AppMenu/>
        : <Link to="/home" className="underlined appears"><span>Sign in</span></Link>
      }
    </header>
  )
}
