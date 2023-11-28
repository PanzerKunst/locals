import { useViewportSize } from "../../Util/BrowserUtils.ts"
import { CircularLoader } from "./CircularLoader.tsx"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

export function ButtonLoader() {
  const viewportWidth = useViewportSize().width
  const viewportWidthXl = parseInt(s.vwXl || "")

  return <CircularLoader size={viewportWidth >= viewportWidthXl ? "md" : "sm"}/>
}
