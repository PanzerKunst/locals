import dayjs from "dayjs"
import { Link } from "react-router-dom"

import "./AppFooter.scss"

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="container">
        <nav>
          <ul className="styleless">
            <li>
              <Link to="/contact" className="underlined appears">Contact</Link>
            </li>
            <li>
              <Link to="/tos" className="underlined appears">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy" className="underlined appears">Privacy Policy</Link>
            </li>
          </ul>
        </nav>

        <div>
          <img src="/images/icon.svg" alt="logo"/>
          <span>&copy; {dayjs().year()}<br/>Get Backstage</span>
        </div>
      </div>
    </footer>
  )
}
