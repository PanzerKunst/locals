import { Modal, ModalDialog } from "@mui/joy"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import { MenuToggle } from "./MenuToggle.tsx"

import { Link } from "react-router-dom"

import s from "/src/UI/_GlobalStyles/_exports.module.scss"
import "./AppMenu.scss"

const modalMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export function AppMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div className="app-menu" initial={false} animate={isOpen ? "open" : "closed"}>
      <MenuToggle onToggle={() => setIsOpen(!isOpen)}/>

      <AnimatePresence>
        {isOpen && (
          <Modal open={isOpen} onClose={() => setIsOpen(false)} className="app-menu-modal">
            <motion.div
              initial={modalMotionVariants.initial}
              animate={modalMotionVariants.animate}
              exit={modalMotionVariants.initial}
              transition={{ duration: Number(s.animationDurationShort) }}
            >
              <ModalDialog layout="fullscreen">
                <MenuToggle onToggle={() => setIsOpen(!isOpen)}/>

                <nav>
                  <ul className="styleless">
                    <li>
                      <Link to="/profile" className="underline appears">My Profile</Link>
                    </li>
                    <li>
                      <Link to="/?action=signOut" className="underline appears">Sign out</Link>
                    </li>
                  </ul>
                </nav>
              </ModalDialog>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
