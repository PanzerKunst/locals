import classNames from "classnames"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { DashboardSidebar } from "./DashboardSidebar.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { AppUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { useHeaderTitle } from "../_CommonComponents/AppHeader/AppHeader.ts"
import { useSidebarNav } from "../_CommonComponents/SidebarNav.ts"

export function DashboardHomePage() {
  const navigate = useNavigate()
  const loggedInUser = useAppContext().loggedInUser?.user
  const { isSidebarHidden, isSidebarHideable } = useSidebarNav()

  useHeaderTitle("Creator Dashboard")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  return (
    <div className={classNames("page with-sidebar dashboard home", { "sidebar-hidden": isSidebarHideable && isSidebarHidden })}>
      <DashboardSidebar />
      <main className="container">
        <h2>Welcome to your Creator Dashboard!</h2>
      </main>
    </div>
  )
}
