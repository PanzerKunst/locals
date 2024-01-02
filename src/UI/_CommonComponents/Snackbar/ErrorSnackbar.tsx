import { faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

import { AppSnackbar } from "./AppSnackbar.tsx"

type Props = {
  message: string
}

export function ErrorSnackbar({ message }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <AppSnackbar
      leftIcon={<FontAwesomeIcon icon={faCircleExclamation} />}
      color="danger"
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
    >
      <div>
        <span>An error occured</span>
        <p className="offset">{message}</p>
      </div>
      <button className="button icon-only" onClick={() => setIsOpen(false)}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </AppSnackbar>
  )
}
