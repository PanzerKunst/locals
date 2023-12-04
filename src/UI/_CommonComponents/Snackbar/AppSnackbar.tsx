import { Snackbar, SnackbarOrigin } from "@mui/joy"
import classNames from "classnames"
import { ReactElement, ReactNode } from "react"

import { useViewportSize } from "../../../Util/BrowserUtils.ts"

import { DefaultColorPalette } from "@mui/joy/styles/types/colorSystem"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./AppSnackbar.scss"

type Props = {
  leftIcon: ReactElement // Expecting a single element
  children: ReactNode
  color: DefaultColorPalette
  anchorOrigin: SnackbarOrigin
  open: boolean
  className?: string
}

export function AppSnackbar({ leftIcon, children, color, anchorOrigin, open, className = "" }: Props) {
  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")

  return (
    <Snackbar
      color={color}
      size={viewportWidth >= viewportWidthMd ? "md" : "sm"}
      variant="solid"
      anchorOrigin={anchorOrigin}
      open={open}
      className={classNames("app-snackbar", className)}
    >
      {leftIcon}
      {children}
    </Snackbar>
  )
}
