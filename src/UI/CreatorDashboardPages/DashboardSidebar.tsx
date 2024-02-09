import classNames from "classnames"
import { useLocation } from "react-router-dom"

import { useSidebarNav } from "../_CommonComponents/SidebarNav.ts"

export function DashboardSidebar() {
  const location = useLocation()
  const { handleClick } = useSidebarNav()

  return (
    <aside>
      <nav>
        <ul className="styleless">
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/dashboard" })}
              onClick={() => handleClick("/dashboard")}
            >
              <span>Home</span>
            </button>
          </li>
          <li>
            <button
              className={classNames("button transparent", { active: location.pathname === "/dashboard/my-posts" })}
              onClick={() => handleClick("/dashboard/my-posts")}
            >
              <span>My Posts</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
