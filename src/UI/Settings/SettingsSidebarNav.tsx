import classNames from "classnames"
import { useLocation, useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"

type Props = {
  isSidebarHideable: boolean
}

export function SettingsSidebarNav({ isSidebarHideable }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsSidebarHidden } = useAppContext()

  const handleClick = (path: string) => {
    isSidebarHideable && setIsSidebarHidden(true)
    navigate(path)
  }

  return (
    <aside>
      <nav>
        <ul className="styleless">
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/settings" })}
              onClick={() => handleClick("/settings")}
            >
              My Account
            </button>
          </li>
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/settings/my-subscriptions" })}
              onClick={() => handleClick("/settings/my-subscriptions")}
            >
              Subscriptions
            </button>
          </li>
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/settings/danger-zone" })}
              onClick={() => handleClick("/settings/danger-zone")}
            >
              Danger Zone
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
