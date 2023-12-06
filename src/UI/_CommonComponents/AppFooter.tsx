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
              <Link to="/privacy" className="underlined appears">Privacy Policy</Link>
            </li>
          </ul>
        </nav>

        <div>
          <img src="/images/icon.svg" alt="logo"/>
          <span>Backstage Pass</span>
          <span>&copy; 8b Services</span>
        </div>
      </div>
    </footer>
  )
}
