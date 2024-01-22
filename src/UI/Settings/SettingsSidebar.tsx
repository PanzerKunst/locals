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
              <span>My Account</span>
            </button>
          </li>
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/settings/my-subscriptions" })}
              onClick={() => handleClick("/settings/my-subscriptions")}
            >
              <span>Subscriptions</span>
            </button>
          </li>
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/settings/danger-zone" })}
              onClick={() => handleClick("/settings/danger-zone")}
            >
              <span>Danger Zone</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
