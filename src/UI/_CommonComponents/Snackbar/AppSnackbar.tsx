import { ColorPaletteProp, Snackbar, SnackbarOrigin } from "@mui/joy"
import classNames from "classnames"
import { ReactNode } from "react"

import { useViewportSize } from "../../../Util/BrowserUtils.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./AppSnackbar.scss"

type Props = {
  children: ReactNode
  color: ColorPaletteProp
  anchorOrigin: SnackbarOrigin
  open: boolean
  className?: string
}

export function AppSnackbar({ children, color, anchorOrigin, open, className = "" }: Props) {
  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "", 10)

  return (
    <Snackbar
      color={color}
      size={viewportWidth >= viewportWidthMd ? "md" : "sm"}
      variant="solid"
      anchorOrigin={anchorOrigin}
      open={open}
      className={classNames("app-snackbar", className)}
    >
      {children}
    </Snackbar>
  )
}
