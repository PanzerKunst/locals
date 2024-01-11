import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { faArrowRightFromBracket, faHouse, faPencil, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons"

import { useAppContext } from "../../../AppContext.tsx"
import { actionsFromAppUrl, appUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"
import { useViewportSize } from "../../../Util/BrowserUtils.ts"
import { Menu } from "../Menu.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./AppHeader.scss"

const headerHeight = parseInt(s.headerHeight!)
const heroPictureMinHeight = parseInt(s.heroPictureMinHeight!)
let lastScrollY = window.scrollY

export function AppHeader() {
  const { loggedInUser, headerTitle } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")
  const isMobile = viewportWidth < viewportWidthMd

  const isLandingPage = location.pathname === "/"
  const isHomepage = location.pathname === "/home" || location.pathname === "/spotify-callback"

  const headerRef = useRef<HTMLHeadingElement>(null)
  const [isDarkBg, setIsDarkBg] = useState(isLandingPage)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const header = headerRef.current

    if (!header) {
      return
    }

    const handleScroll = !isMobile || isLandingPage ? handleScrollDesktop : handleScrollMobile

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

      if (isLandingPage) {
        setIsDarkBg(currentScrollY < heroPictureMinHeight)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLandingPage, isMobile])

  return (
    <div className="app-header-wrapper">
      <header
        ref={headerRef}
        className={classNames({
          "desktop-or-landing": !isMobile || isLandingPage,
          mobile: isMobile,
          dark: isDarkBg,
          "menu-open": isMenuOpen
        })}
        style={!isMobile || isLandingPage ? { top: 0 } : { bottom: 0 }}
      >
        <div className="left-image-wrapper"/>

        {headerTitle && <h2>{headerTitle}</h2>}

        {!loggedInUser && <Link to="/home" className="underlined appears"><span>Sign in</span></Link>}

        {loggedInUser && (isLandingPage || isHomepage) && (
          <button className="button icon-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img src={loggedInUser.avatarUrl} alt="User's avatar"/>
          </button>
        )}

        {loggedInUser && !isLandingPage && !isHomepage && (
          <Link to="/home" className="button icon-only offset-bg-on-hover"><FontAwesomeIcon icon={faXmark}/></Link>
        )}
      </header>

      {isMenuOpen && ( /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-to-interactive-role */
        <Menu close={() => setIsMenuOpen(false)}>
          {isLandingPage ? (
            <li role="link" onClick={() => {
              navigate("/home")
              setIsMenuOpen(false)
            }}>
              <FontAwesomeIcon icon={faHouse} />
              <span>Home</span>
            </li>
          ) : (
            <li role="link" onClick={() => {
              navigate("/posts")
              setIsMenuOpen(false)
            }}>
              <FontAwesomeIcon icon={faHouse} />
              <span>Creator dashboard</span>
            </li>
          )}
          <li role="link" onClick={() => {
            navigate("/compose")
            setIsMenuOpen(false)
          }}>
            <FontAwesomeIcon icon={faPencil}/>
            <span>Compose</span>
          </li>
          <li role="link" onClick={() => {
            navigate("/settings")
            setIsMenuOpen(false)
          }}>
            <FontAwesomeIcon icon={faSliders}/>
            <span>Settings</span>
          </li>
          <li role="link" onClick={() => {
            navigate(`/?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.SIGN_OUT}`)
            setIsMenuOpen(false)
          }}>
            <FontAwesomeIcon icon={faArrowRightFromBracket}/>
            <span>Sign out</span>
          </li>
        </Menu>
        /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-to-interactive-role */
      )}
    </div>
  )
}
