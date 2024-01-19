import { faCircleCheck } from "@fortawesome/free-regular-svg-icons"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ReactNode, useState } from "react"

import { AppSnackbar } from "./AppSnackbar.tsx"

type Props = {
  children: ReactNode;
}

export function SuccessSnackbar({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <AppSnackbar
      leftIcon={<FontAwesomeIcon icon={faCircleCheck} />}
      color="success"
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
    >
      <div>
        {children}
      </div>
      <button className="button icon-only light" onClick={() => setIsOpen(false)}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </AppSnackbar>
  )
}
