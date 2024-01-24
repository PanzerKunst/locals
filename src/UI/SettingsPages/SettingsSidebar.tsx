import classNames from "classnames"
import { useLocation, useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"

import "./SettingsSidebar.scss"

type Props = {
  isHideable: boolean
}

export function SettingsSidebar({ isHideable }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsSidebarHidden } = useAppContext()

  const handleClick = (path: string) => {
    isHideable && setIsSidebarHidden(true)
    navigate(path)
  }

  return (
    <aside className="settings-sidebar">
      <nav>
        <ul className="styleless">
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/settings" })}
              onClick={() => handleClick("/settings")}
            >
              <span>Account</span>
            </button>
          </li>
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/settings/subscriptions" })}
              onClick={() => handleClick("/settings/subscriptions")}
            >
              <span>Subscriptions</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
