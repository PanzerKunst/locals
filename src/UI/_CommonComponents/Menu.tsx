import { Modal } from "@mui/joy"
import { ReactNode, useEffect } from "react"

import "./Menu.scss"

type Props = {
  children: ReactNode;
  close: () => void;
  className?: string;
}

export function Menu({ children, close, className = "" }: Props) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [close])

  const handleBackdropClick = () => {
    close()
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
      <ul role="listbox" className={`styleless menu ${className}`}>
        {children}
      </ul>

      <Modal open className="invisible-backdrop" onClick={handleBackdropClick}>
        <div/>
      </Modal>
    </>
  )
}
