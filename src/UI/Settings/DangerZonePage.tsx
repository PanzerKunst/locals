import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Modal, ModalDialog } from "@mui/joy"
import classNames from "classnames"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { SettingsSidebarNav } from "./SettingsSidebarNav.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { deleteUser } from "../../Data/Backend/Apis/UsersApi.ts"
import { ActionsFromAppUrl, AppUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import { AnimatePresence, motion } from "framer-motion"
import { faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons"

import { useViewportSize } from "../../Util/BrowserUtils.ts"
import { useHeaderTitle } from "../_CommonComponents/AppHeader/AppHeader.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

const modalMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export function DangerZonePage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const loggedInUser = appContext.loggedInUser?.user
  const { isSidebarHidden } = appContext

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")
  const isSidebarHideable = viewportWidth < viewportWidthMd

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useHeaderTitle(isSidebarHideable && !isSidebarHidden ? "Settings" : "Danger Zone")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const handleConfirmDeleteClick = async () => {
    await deleteUser(loggedInUser!)
    setIsDeleteDialogOpen(false)
    navigate(`/?${AppUrlQueryParam.ACTION}=${ActionsFromAppUrl.SIGN_OUT}`)
  }

  return (
    <div className={classNames("page settings with-sidebar danger-zone", { "sidebar-hidden": isSidebarHideable && isSidebarHidden })}>
      <SettingsSidebarNav isSidebarHideable={isSidebarHideable}/>
      <main className="container">
        <FadeIn className="wrapper-next-button">
          <button className="button filled" onClick={() => setIsDeleteDialogOpen(true)}>
            <span>Delete account</span>
          </button>
        </FadeIn>

        <AnimatePresence>
          {isDeleteDialogOpen && (
            <Modal open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
              <motion.div
                initial={modalMotionVariants.initial}
                animate={modalMotionVariants.animate}
                exit={modalMotionVariants.initial}
                transition={{ duration: Number(s.animationDurationSm) }}
              >
                <ModalDialog>
                  <button className="button icon-only close" aria-label="close" onClick={() => setIsDeleteDialogOpen(false)}>
                    <FontAwesomeIcon icon={faXmark}/>
                  </button>
                  <div>
                    <span>Are you sure? Deletion is final.</span>
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <button className="button filled fixed-height" onClick={handleConfirmDeleteClick}>
                      <FontAwesomeIcon icon={faTrashCan}/>
                      <span>Delete my account</span>
                    </button>
                  </div>
                </ModalDialog>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
