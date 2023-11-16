import { Link } from "react-router-dom"

import "./AppFooter.scss"

export function AppFooter() {
  return (
    <footer className="app-footer container">
      <nav>
        <ul className="styleless">
          <li>
            <Link to="/privacy" className="underline appears">Privacy Policy</Link>
          </li>
        </ul>
      </nav>

      <span>&copy; 8b Services</span>
    </footer>
  )
}
