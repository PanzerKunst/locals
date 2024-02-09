import { useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"
import { useViewportSize } from "../../Util/BrowserUtils.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

export function useSidebarNav() {
  const navigate = useNavigate()
  const { isSidebarHidden, setIsSidebarHidden } = useAppContext()

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")
  const isSidebarHideable = viewportWidth < viewportWidthMd

  const handleClick = (path: string) => {
    isSidebarHideable && setIsSidebarHidden(true)
    navigate(path)
  }

  return { isSidebarHidden, isSidebarHideable, handleClick }
}
