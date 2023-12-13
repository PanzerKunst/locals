import { CheckCircleOutline, Close } from "@mui/icons-material"
import { ReactNode, useState } from "react"

import { AppSnackbar } from "./AppSnackbar.tsx"

type Props = {
  children: ReactNode;
}

export function SuccessSnackbar({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <AppSnackbar
      leftIcon={<CheckCircleOutline/>}
      color="success"
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
    >
      <div>
        {children}
      </div>
      <button className="button icon-only" onClick={() => setIsOpen(false)}>
        <Close/>
      </button>
    </AppSnackbar>
  )
}
