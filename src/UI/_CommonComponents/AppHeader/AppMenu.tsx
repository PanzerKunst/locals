import { Drawer } from "@mui/joy"
import { motion } from "framer-motion"
import { KeyboardEvent, MouseEvent } from "react"
import { useState } from "react"

import { MenuToggle } from "./MenuToggle.tsx"

import "./AppMenu.scss"

export function AppMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = (inOpen: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as KeyboardEvent).key === "Tab" || (event as KeyboardEvent).key === "Shift")
    ) {
      return
    }

    setIsOpen(inOpen)
  }

  // TODO: remove
  console.log("isOpen", isOpen)

  return (
    <motion.div className="app-menu" initial={false} animate={isOpen ? "open" : "closed"}>
      <MenuToggle onToggle={() => setIsOpen(!isOpen)}/>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer(false)}
        anchor="right"
        className="app-menu-drawer"
      >
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <nav>
            <ul>
              {["Inbox", "Starred", "Send email", "Drafts"].map((text) => (
                <li key={text}>
                  {text}
                </li>
              ))}
            </ul>
            <ul>
              {["All mail", "Trash", "Spam"].map((text) => (
                <li key={text}>
                  {text}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Drawer>
    </motion.div>
  )
}
