import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
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
      leftIcon={<FontAwesomeIcon icon={faCheck} />}
      color="neutral"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isOpen}
    >
      <div>
        {children}
      </div>
      <button className="button icon-only" onClick={handleCloseClick}>
        {<FontAwesomeIcon icon={faXmark} />}
      </button>
    </AppSnackbar>
  )
}
