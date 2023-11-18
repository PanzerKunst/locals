import { Close, ErrorOutline } from "@mui/icons-material"
import { useState } from "react"

import { AppSnackbar } from "./AppSnackbar.tsx"

import "./ErrorSnackbar.scss"

type Props = {
  message: string
}

export function ErrorSnackbar({ message }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <AppSnackbar
      color="danger"
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
      className="error"
    >
      <ErrorOutline/>
      <div>
        <span>An error occured</span>
        <p className="offset">{message}</p>
      </div>
      <button className="icon-only" onClick={() => setIsOpen(false)}>
        <Close/>
      </button>
    </AppSnackbar>
  )
}
