import { Check, Close } from "@mui/icons-material"
import { ReactNode, useState } from "react"

import { AppSnackbar } from "./AppSnackbar.tsx"

type Props = {
  children: ReactNode;
  onClose?: () => void;
}

export function BottomRightInfoSnackbar({ children, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  const handleCloseClick = () => {
    setIsOpen(false)
    onClose && onClose()
  }

  return (
    <AppSnackbar
      leftIcon={<Check/>}
      color="neutral"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isOpen}
    >
      <div>
        {children}
      </div>
      <button className="button icon-only" onClick={handleCloseClick}>
        <Close/>
      </button>
    </AppSnackbar>
  )
}
